import * as tf from "@tensorflow/tfjs";

export class ImageRankingModel {
  modelName = "image-ranker-net-v1";
  modelSaveStrategy = "indexeddb";
  model = tf.sequential();

  constructor() {
    // load the saved model for once

    tf.loadLayersModel(this.modelSaveLocation)
      .then((model) => {
        console.log(model);
        this.model = model;
      })
      .catch((_) => {
        console.log("ERROR")
        this.model = tf.sequential({
          layers: [
            tf.layers.dense({
              inputShape: [1280],
              units: 1,
              activation: "sigmoid",
            }),
          ],
        });
      })
      .finally((model) => {
        if (!this.model) return;
        this.model.compile({
          loss: "binaryCrossentropy",
          optimizer: "adam",
          metrics: ["accuracy"],
        });

        this.model.save(this.modelSaveLocation);
      });
  }

  loadWeights(weights) {
    this.model.setWeights(weights);
  }

  extractWeights() {
    return this.model.getWeights().map((weights) => weights.arraySync());
  }

  saveModelToLocalStorage() {
    this.model.save(this.modelSaveLocation);
  }

  async loadModelFromLocalStorage() {
    try {
      this.modle = await tf.loadLayersModel(this.modelSaveLocation);
    } catch (err) {}
  }

  get modelSaveLocation() {
    return `${this.modelSaveStrategy}://${this.modelName}`;
  }
}
