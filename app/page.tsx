"use client";
import * as tf from "@tensorflow/tfjs";
import { useState, useEffect, RefObject } from "react";
import { ImageWindow } from "./components/ImageWindow";
import { IUnsplashImage } from "./api/images/IUnsplashImageHttp";

import { useImageDataset } from "./hooks/useImageDataset";
import { useImageLoader } from "./hooks/useImageLoader";
import { useModelTrainer } from "./hooks/useModelTrainer";
import { useModelEvaluator } from "./hooks/useModelEvaluator";
import { useFeatureExtractor } from "./hooks/useFeatureExtractor";
import { ImageScroller } from "./components/ImageScroller";

export default function Home() {
  const [imageList, setImageList] = useState<Array<IUnsplashImage>>([]);

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
    const { labelTensors, trainingTensors } = imageDataset.getTrainingData();
    // const history = await modelTrainer.fitModel(trainingTensors, labelTensors);

    // metrics

    const predictions = imageDataset.evaluationLabels;
    const labels = labelTensors.flatten().arraySync();
    const modelScore = modelEvaluator.computeModelScore(predictions, labels);
    console.log(predictions, labels, modelScore);
  };

  const handleImageLoad = async (
    imageRef: RefObject<HTMLImageElement>,
    index: number
  ) => {
    const imageFeatures = featureExtractor.extractImageFeatures(imageRef);
    imageDataset.updateTrainingSample(imageFeatures, index);

    // model predictions

    if (modelTrainer.rankerModel) {
      const modelPrediction = modelTrainer.rankerModel.predict(
        imageFeatures as tf.Tensor
      ) as tf.Tensor;
      const probablity = await modelPrediction.data();
      imageDataset.updateEvaluationLabels(probablity[0], index);
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
      {/* <button onClick={fitModel}>Train</button> */}
      <ImageScroller>
        {imageList.map((data, index) => (
          <ImageWindow
            key={index}
            source={data.urls.regular}
            description={data.description}
            imageLiked={(value) =>
              imageDataset.updateTrainingLabels(value, index)
            }
            onImageLoaded={(e) => handleImageLoad(e, index)}
          />
        ))}
      </ImageScroller>
    </div>
  );
}
