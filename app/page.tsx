"use client";
import * as tf from "@tensorflow/tfjs";
import { useState, useEffect, RefObject } from "react";
import { ImageWindow } from "./components/ImageWindow";
import { useImageDataset } from "./hooks/useImageDataset";
import { useImageLoader } from "./hooks/useImageLoader";
import { useModelTrainer } from "./hooks/useModelTrainer";
import { useModelEvaluator } from "./hooks/useModelEvaluator";
import { useFeatureExtractor } from "./hooks/useFeatureExtractor";
import {
  ImageScroller,
  ScrollListenerPayload,
} from "./components/ImageScroller";
import {
  ImageExtractedFeatureTensorType,
  useImageDatasetV2,
} from "./hooks/useImageDatasetV2";
import { ImageViewModel } from "./models/ImageViewModel";

export default function Home() {
  const [imageList, setImageList] = useState<Array<ImageViewModel>>([]);

  // NEW CODE

  const imageDatasetV2 = useImageDatasetV2();
  const imageLoader = useImageLoader();
  const modelTrainer = useModelTrainer();
  const modelEvaluator = useModelEvaluator();
  const featureExtractor = useFeatureExtractor();

  const initApp = async () => {
    const images = await imageLoader.loadImages();
    setImageList(images);
    modelTrainer.loadModel();
  };

  const fetchNewImages = async () => {
    const images = await imageLoader.loadImages();
    setImageList((previous) => [...previous, ...images]);
  };

  const fitModel = async () => {
    const { labelTensors, trainingTensors } = imageDatasetV2.buildTrainingBatch(
      imageList,
      100
    );
    const history = await modelTrainer.fitModel(trainingTensors, labelTensors);

    // metrics

    // const predictions = imageDataset.evaluationLabels;
    // const labels = labelTensors.flatten().arraySync();
    // const modelScore = modelEvaluator.computeModelScore(predictions, labels);
    // console.log(predictions, labels, modelScore);
  };

  const handleImageLoad = async (
    imageRef: RefObject<HTMLImageElement>,
    imageData: ImageViewModel
  ) => {
    const imageFeatures = featureExtractor.extractImageFeatures(imageRef);
    imageData.setImageFeatureTensor(imageFeatures);

    const likePrediction = await predictImage(imageFeatures);
    if (likePrediction) {
      const willLikeImage = likePrediction[0] > 0.75;
      if (willLikeImage) {
        setImageList((prev) => {
          const newState = prev.map((item) => {
            if (item.id == imageData.id) {
              item.setLikePredicted(true);
              return item;
            }
            return item;
          });

          return newState;
        });
      }
    }
  };

  const predictImage = async (
    imageFeatures: ImageExtractedFeatureTensorType
  ) => {
    if (modelTrainer.rankerModel) {
      const modelPrediction = modelTrainer.rankerModel.predict(
        imageFeatures as tf.Tensor
      ) as tf.Tensor;
      const probablity = await modelPrediction.data();
      return probablity;
    }
  };

  const handleScrollListener = (payload: ScrollListenerPayload) => {
    // mark current element as visited first

    console.log(imageList);
    if (!imageList.length) return;

    const currElem = imageList[payload.activeElement];
    currElem.setImageVisited(true);

    // we have to take care of triggering the training and loading new functions from within this function
    const totalImagesNotVisited = imageList.reduce((prev, curr) => {
      if (!curr.imageVisited) {
        return prev + 1;
      }
      return prev;
    }, 0);

    if (totalImagesNotVisited <= 5) {
      fetchNewImages();
    }

    const imageVisitedCount = imageList.length - totalImagesNotVisited;

  
    console.log(imageVisitedCount);
    if (imageVisitedCount == 100) {
      fitModel();
    }
  };

  useEffect(() => {
    initApp();
  }, []);

  if (!featureExtractor.featureExtractorModel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto">
      <ImageScroller
        childrenLength={imageList.length}
        scrollListener={handleScrollListener}
      >
        {imageList.map((data, index) => (
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
