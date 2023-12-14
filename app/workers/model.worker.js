import * as tf from "@tensorflow/tfjs";
import { ImageRankingModel } from "../ml-models/ImageRankerModel";
// DEFINE MODEL

const rankerModel = new ImageRankingModel();

const trainModel = async (payload) => {
  console.log("TRAINING FROM WORKER");
  const { trainingSamples: batchSamples } = payload;

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
    epochs: 200,
    shuffle: true,
    callbacks: {
      onEpochEnd(epoch, logs) {
        self.postMessage({
          type: "TRAIN_EPOCH_UPDATE",
          data: { ...epoch, ...logs },
        });
      },

      async onTrainEnd() {
        // extract the model weights
        await rankerModel.saveModelToLocalStorage();
        self.postMessage({ type: "TRAIN_COMPLETE" });
      },
    },
  });
};

const workerEventHandler = {
  TRAIN_MODEL: (props) => trainModel(props),
};

console.log("WORKER INJECTED");

self.addEventListener("message", (e) => {
  if (e.data.request == "TRAIN_MODEL") {
    trainModel({ ...e.data });
  }
});
