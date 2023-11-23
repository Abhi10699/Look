import { useState } from "react";
import * as tf from "@tensorflow/tfjs";

export const useModelTrainer = () => {
  const [rankerModel, setRankerModel] = useState<tf.LayersModel>();
  const [isTraining, setIsTraining] = useState(false);

  const setupModel = () => {
    const rankingModel = tf.sequential();

    rankingModel.add(
      tf.layers.dense({
        inputShape: [1280],
        units: 512,
        activation: "relu",
      })
    );

    tf.layers.dense({
      units: 512,
      activation: "relu",
    });

    rankingModel.add(
      tf.layers.dense({
        units: 1,
        activation: "sigmoid",
      })
    );

    rankingModel.compile({
      loss: "binaryCrossentropy",
      optimizer: "adam",
      metrics: ["accuracy"],
    });

    return rankingModel;
  };

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
      console.log("Initialising new model");
      const model = setupModel();
      setRankerModel(model);
    }
  };

  const fitModel = async (inputs: tf.Tensor, labels: tf.Tensor) => {
    if (!rankerModel) return;

    // fit model
    setIsTraining(true);
    const trainingHistory = await rankerModel.fit(inputs, labels, {
      epochs: 10,
      shuffle: true,
      callbacks: {
        onEpochEnd(epoch, logs) {
          console.log(`Epoch: ${epoch} ==> Loss:`, logs);
        },

        async onTrainEnd() {
          // save model
          await saveModel();

          // notify frontend
          setIsTraining(false);
        },
      },
    });

    return trainingHistory;
  };

  return {
    fitModel,
    loadModel,
    saveModel,
    isTraining,
    rankerModel,
  };
};
