"use client";
import { useEffect, RefObject } from "react";
import { ImageWindow } from "./components/ImageWindow";
import { useImageManager } from "./hooks/useImageLoader";
import { useModelTrainer } from "./hooks/useModelTrainer";
import { useFeatureExtractor } from "./hooks/useFeatureExtractor";
import {
  ImageScroller,
  ScrollListenerPayload,
} from "./components/ImageScroller";
import { ImageViewModel } from "./models/ImageViewModel";

export default function Home() {
  const { images, triggerFetch, updateArrayField } = useImageManager();
  const { fitModel, predict, loadModel } = useModelTrainer({
    trainingBatchSize: 10,
  });
  const featureExtractor = useFeatureExtractor();

  const handleImageLoad = async (
    imageRef: RefObject<HTMLImageElement>,
    imageData: ImageViewModel
  ) => {
    const imageFeatures = featureExtractor.extractImageFeatures(imageRef);
    imageData.setImageFeatureTensor(imageFeatures);

    const likePrediction = await predict(imageFeatures);

    if (!likePrediction) return;

    const willLike = likePrediction[0] > 0.75;
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

    const imageVisitedCount = images.length - totalImagesNotVisited;
    const history = imageVisitedCount == 5 && (await fitModel(images));
  };

  useEffect(() => {
    loadModel();
  }, []);

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
