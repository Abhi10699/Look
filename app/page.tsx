"use client";
import { RefObject, useContext, useEffect } from "react";
import { ImageWindow } from "./components/ImageWindow";
import { useImageManager } from "./hooks/useImageLoader";
import { useFeatureExtractor } from "./hooks/useFeatureExtractor";
import {
  ImageScroller,
  ScrollListenerPayload,
} from "./components/ImageScroller";
import { ImageViewModel } from "./models/ImageViewModel";
import { useModelHandler } from "./hooks/useModelHandler";
import { useModelEvaluator } from "./hooks/useModelEvaluator";
import { ModelContext } from "./context/ModelContext";

const TRAINING_TRIGGER_BATCH = 15;

export default function Home() {
  const { images, triggerFetch, updateArrayField, buildTrainingBatch } =
    useImageManager({
      trainingBatchSize: TRAINING_TRIGGER_BATCH,
    });

  const { predict, train } = useModelHandler();
  const featureExtractor = useFeatureExtractor();
  const { computeModelScore } = useModelEvaluator();
  const { dispatch, state } = useContext(ModelContext);

  const handleImageLoad = async (
    imageRef: RefObject<HTMLImageElement>,
    imageData: ImageViewModel
  ) => {
    const imageFeatures = await featureExtractor.extractImageFeatures(imageRef);
    imageData.setImageFeatureTensor(imageFeatures);

    const likePrediction = await predict(imageFeatures);
    const willLike = likePrediction[0] > 0.75;

    // this could be improved if we use key value pairs in image state..
    willLike &&
      updateArrayField((item) => {
        if (item.id == imageData.id) {
          item.setLikePredicted(true);
        }
        return item;
      });
  };

  const predictLikesForImages = async () => {
    const willLikePromises: { [id: string]: boolean } = images
      .filter((image) => !image.imageUsedInTraining)
      .reduce(async (prev, curr) => {
        const likePrediction = await predict(curr.imageFeatureTensor);
        const willLike = likePrediction[0] > 0.75;
        return { ...prev, [curr.id]: willLike };
      }, {});

    updateArrayField((image) => {
      if (willLikePromises[image.id]) {
        image.setLikePredicted(willLikePromises[image.id]);
      }
      return image;
    });
  };

  const handleScrollListener = async (payload: ScrollListenerPayload) => {
    if (!images.length) return;

    const currElem = images[payload.activeElement];
    currElem.setImageVisited(true);

    const totalImagesNotVisited = images.reduce((prev, curr) => {
      return !curr.imageVisited ? prev + 1 : prev;
    }, 0);

    totalImagesNotVisited <= 5 && triggerFetch();

    // train model every 100 steps, if the model already trained 10 times put the model into evaluation mode
    if (
      payload.activeElement != 0 &&
      payload.activeElement % TRAINING_TRIGGER_BATCH == 0
    ) {
      // compute metrics
      const samples = images
        .filter((sample) => !sample.imageEvaluated)
        .slice(0, TRAINING_TRIGGER_BATCH)
        .map((sample) => {
          sample.setImageEvaluated(true);
          return sample;
        });
      const predictions = samples.map((sample) => Number(sample.likePredicted));
      const groundTruths = samples.map((sample) => Number(sample.imageLiked));

      const modelScore = computeModelScore(predictions, groundTruths);
      dispatch({ type: "SET_MODEL_SCORE", payload: { score: modelScore } });

      // if the model score falls below 50% we retrain this model but
      // if we've not trained model for atlease 10 times, we have to train it again

      if (state.modelOverallTrainingCount < 5 || modelScore < 0.5) {
        train(buildTrainingBatch());
        dispatch({ type: "SET_MODEL_MODE_TRAINING" });
        dispatch({
          type: "SET_MODEL_TRAINING_COUNT",
          payload: { count: 1 },
        });
      } else {
        dispatch({ type: "SET_MODEL_MODE_INFERENCE" });
      }
    }
  };

  useEffect(() => {
    console.log(state.modelRefreshCounter)
    if (state.modelRefreshCounter != 0) {
      predictLikesForImages();
    }
  }, [state.modelRefreshCounter]);

  if (!featureExtractor.featureExtractorModel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto">
      <ImageScroller
        childrenLength={images.length}
        scrollListener={handleScrollListener}
      >
        {images.map((data, index) => (
          <ImageWindow
            key={index}
            imageData={data}
            onImageLoaded={(e, imageData) => handleImageLoad(e, imageData)}
          />
        ))}
      </ImageScroller>
    </div>
  );
}
