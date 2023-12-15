import { useState } from "react";
import { ImageExtractedFeatureTensorType } from "./useImageDatasetV2";
import { ImageViewModel } from "../../models/ImageViewModel";

import * as tf from "@tensorflow/tfjs";

type useModelTrainerProps = {
  trainingBatchSize: number;
};
export const useModelTrainer = (props: useModelTrainerProps) => {
  const [rankerModel, setRankerModel] = useState<tf.LayersModel>();
  const [isTraining, setIsTraining] = useState(false);

  const saveModel = async () => {
    if (rankerModel) {
      await rankerModel.save("localstorage://im-ranker-model-v1");
    }
  };

  const loadModel = async () => {
    try {
      const loadedModel = await tf.loadLayersModel(
        "localstorage://im-ranker-model-v1"
      );
      loadedModel.compile({
        loss: "binaryCrossentropy",
        optimizer: "adam",
        metrics: ["accuracy"],
      });

      // TODO: There should be some metric that decides what layer to train

      // loadedModel.layers[0].trainable = false;

      console.log("Loading Cached Model");
      setRankerModel(loadedModel);
    } catch (error) {
      // console.log("Initialising new model");
      // const model = setupModel();
      // setRankerModel(model);
    }
  };

  const buildTrainingBatch = (samples: ImageViewModel[]) => {
    if (samples.length < props.trainingBatchSize) {
      throw new Error("Not enough training samples!");
    }

    const trainingSamples = samples
      .filter((sample) => !sample.imageUsedInTraining)
      .map((sample) => {
        sample.setImageUsedInTraining(true);
        return {
          features: sample.imageFeatureTensor,
          label: Number(sample.imageLiked),
        };
      });

    const batchSamples = trainingSamples.slice(0, props.trainingBatchSize);
    return { batchSamples };
  };

  const predict = async (imageFeatures: ImageExtractedFeatureTensorType) => {
    if (rankerModel) {
      const modelPrediction = rankerModel.predict(
        imageFeatures as tf.Tensor
      ) as tf.Tensor;
      const probablity = await modelPrediction.data();
      return probablity;
    }
  };

  return {
    loadModel,
    saveModel,
    isTraining,
    rankerModel,
    buildTrainingBatch,
    predict,
  };
};