import * as tf from "@tensorflow/tfjs";
import { ImageRankingModel } from "../ml-models/ImageRankerModel";
// DEFINE MODEL

const rankerModel = new ImageRankingModel();

const trainModel = async (payload) => {
  const { batchSamples } = payload;

  // convert to tensor
  const batchInputTensors = batchSamples.map((samples) =>
    tf.tensor(samples.features, [1, 1280])
  );

  const trainingInputs = tf.concat(batchInputTensors);

  const trainingLabels = tf.tensor2d(
    batchSamples.map((sample) => sample.label),
    [batchSamples.length, 1]
  );

  await rankerModel.model.fit(trainingInputs, trainingLabels, {
    epochs: 10,
    shuffle: true,
    callbacks: {
      onEpochEnd(epoch, logs) {
        self.postMessage("TRAIN_EPOCH_UPDATE", { ...epoch, ...logs });
      },

      onTrainEnd() {
        // extract the model weights
        rankerModel.saveModelToLocalStorage();
        self.postMessage({ type: "TRAIN_COMPLETE" });
      },
    },
  });
};

const workerEventHandler = {
  TRAIN_MODEL: (props) => trainModel(props),
};

addEventListener("message", ({ data }) =>
  workerEventHandler[data.request](data)
);
