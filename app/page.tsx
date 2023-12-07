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

  const imageDataset = useImageDataset({ batchSize: 30 });
  const imageLoader = useImageLoader();
  const modelTrainer = useModelTrainer();
  const modelEvaluator = useModelEvaluator();
  const featureExtractor = useFeatureExtractor();

  const initApp = async () => {
    const images = await imageLoader.loadImages();
    setImageList(images);
    imageDataset.unsetDataset();
    modelTrainer.loadModel();
  };

  const fitModel = async () => {
    const { labelTensors, trainingTensors } =
      imageDatasetV2.buildTrainingBatch(30);
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
    imageDatasetV2.addTrainingSample({
      feature: imageFeatures,
      label: false, // user hasn't seen this image yet so not liked
      uuid: imageData.id,
      usedInTraining: false,
    });

    // model predictions

    const likePrediction = await predictImage(imageFeatures);
    if (likePrediction) {
      imageData.setLikePredicted(likePrediction[0] > 0.5);
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
    // check if everything is visited
    if (payload.visitedLog.length != 30 || modelTrainer.isTraining) {
      return;
    }
    const allVisited = payload.visitedLog.every((visited) => visited == 1);
    if (allVisited) {
      fitModel();
    }
  };

  const handleImageLike = (imageData: ImageViewModel, liked: boolean) => {
    imageDatasetV2.updateTrainingSample(imageData.id, liked);
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
            imageLiked={handleImageLike}
            onImageLoaded={(e, imageData) => handleImageLoad(e, imageData)}
          />
        ))}
      </ImageScroller>
    </div>
  );
}
