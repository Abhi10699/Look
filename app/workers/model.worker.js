import * as tf from "@tensorflow/tfjs";

// DEFINE MODEL

async function getModel() {
  const rankingModel = tf.sequential();

  rankingModel.add(
    tf.layers.dense({
      inputShape: [1280],
      units: 512,
      activation: "relu",
    })
  );

  rankingModel.add(
    tf.layers.dense({
      units: 512,
      activation: "relu",
    })
  );

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
}
const model = await getModel();

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

  await model.fit(trainingInputs, trainingLabels, {
    epochs: 500,
    shuffle: true,
    callbacks: {
      onEpochEnd(epoch, logs) {
        console.log(epoch, logs);
        self.postMessage("TRIN_EPOCH_UPDATE", { ...epoch, ...logs });
      },

      onTrainEnd() {
        self.postMessage("TRAIN_COMPLETE");
        model.save("localstorage://im-ranker-model-v1");
      },
    },
  });
};

const predict = async (payload) => {
  const { inputData } = payload;
};

addEventListener("message", (event) => {
  try {
    // train model
    const { request, ...payload } = event.data;
    if (request == "TRAIN_MODEL") {
      trainModel(payload);
    } else if (request == "PREDICT") {
      predict(payload);
    }
  } catch (err) {}
});
