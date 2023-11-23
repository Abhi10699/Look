import { useEffect, useState, RefObject } from "react";
import * as tf from "@tensorflow/tfjs";

const MODEL_URL =
  "https://www.kaggle.com/models/google/mobilenet-v2/frameworks/TfJs/variations/035-224-feature-vector/versions/3";

export const useFeatureExtractor = () => {
  const [featureExtractorModel, setFeatureExtractorModel] =
    useState<tf.GraphModel>();
  const [modelError, setModelError] = useState<any>();

  useEffect(() => {
    tf.loadGraphModel(MODEL_URL, { fromTFHub: true })
      .then((model) => {
        console.log("[!] Feature Extractor Loaded...")
        setFeatureExtractorModel(model);
      })
      .catch((err) => setModelError);
  }, []);

  const extractImageFeatures = (imageRef: RefObject<HTMLImageElement>) => {
    if (!featureExtractorModel) {
      throw new Error("Feature Extractor is not loaded..");
    }

    if (!imageRef.current) {
      throw new Error("Image Refrence is invalid");
    }
    const imageTensor = tf.browser.fromPixels(imageRef.current).toFloat();
    const resizedImage = tf.image
      .resizeBilinear(imageTensor, [224, 224])
      .expandDims();

    const mobilenetPrediction = featureExtractorModel.predict(resizedImage);
    return mobilenetPrediction;
  };

  return {
    featureExtractorModel,
    modelError,
    extractImageFeatures,
  };
};
