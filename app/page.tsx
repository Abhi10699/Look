"use client";
import { RefObject } from "react";
import { ImageWindow } from "./components/ImageWindow";
import { useImageManager } from "./hooks/useImageLoader";
import { useFeatureExtractor } from "./hooks/useFeatureExtractor";
import {
  ImageScroller,
  ScrollListenerPayload,
} from "./components/ImageScroller";
import { ImageViewModel } from "./models/ImageViewModel";
import { useModelHandler } from "./hooks/useModelHandler";

export default function Home() {
  const { images, triggerFetch, updateArrayField, buildTrainingBatch } =
    useImageManager({
      trainingBatchSize: 10,
    });

  const { predict, train } = useModelHandler();
  const featureExtractor = useFeatureExtractor();

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

  const handleScrollListener = async (payload: ScrollListenerPayload) => {
    if (!images.length) return;

    const currElem = images[payload.activeElement];
    currElem.setImageVisited(true);

    const totalImagesNotVisited = images.reduce((prev, curr) => {
      return !curr.imageVisited ? prev + 1 : prev;
    }, 0);

    totalImagesNotVisited <= 5 && triggerFetch();

    // train model every 100 steps
    if (payload.activeElement != 0 && payload.activeElement % 10 == 0 ) {
      train(buildTrainingBatch());
    }
  };

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
