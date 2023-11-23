"use client";
import * as tf from "@tensorflow/tfjs";

import { useState, useEffect } from "react";
import { ImageWindow } from "./components/ImageWindow";
import { IUnsplashImage } from "./api/images/IUnsplashImageHttp";
import { loadMobileNetModel } from "./utils";
import { useImageDataset } from "./hooks/useImageDataset";
import { useImageLoader } from "./hooks/useImageLoader";
import { useModelTrainer } from "./hooks/useModelTrainer";

export default function Home() {
  const [imageList, setImageList] = useState<Array<IUnsplashImage>>([]);
  const [mobileNetModel, setMobileNetModel] = useState<tf.GraphModel>();

  const imageDataset = useImageDataset({ batchSize: 30 });
  const imageLoader = useImageLoader();
  const modelTrainer = useModelTrainer();

  const initApp = async () => {
    if (!mobileNetModel) {
      const featureExtractorModel = await loadMobileNetModel();
      setMobileNetModel(featureExtractorModel);
    }

    // load images
    const images = await imageLoader.loadImages();
    setImageList(images);

    // setup database
    imageDataset.unsetDataset();

    // setup model
    modelTrainer.loadModel();
  };

  const fitModel = async () => {
    const { labelTensors, trainingTensors } = imageDataset.getTrainingData();
    const history = await modelTrainer.fitModel(trainingTensors, labelTensors);
    console.log(history);
  };

  useEffect(() => {
    initApp();
  }, []);

  if (!mobileNetModel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      {imageList.map((data, index) => (
        <ImageWindow
          key={index}
          source={data.urls.small}
          description={data.description}
          featureExtractor={mobileNetModel}
          featuresExtracted={(feature) =>
            imageDataset.updateTrainingSample(feature, index)
          }
          predictionModel={modelTrainer.rankerModel}
          imageLiked={(value) =>
            imageDataset.updateTrainingLabels(value, index)
          }
        />
      ))}

      <button onClick={fitModel}>Train</button>
    </div>
  );
}
