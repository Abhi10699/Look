import * as tf from "@tensorflow/tfjs";
import { ImageViewModel } from "../models/ImageViewModel";

export type ImageExtractedFeatureTensorType =
  | tf.Tensor<tf.Rank>
  | tf.Tensor<tf.Rank>[]
  | tf.NamedTensorMap;

export const useImageDatasetV2 = () => {
  const buildTrainingBatch = (samples: ImageViewModel[], batchSize = 30) => {
    if (samples.length < batchSize) {
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

    const batchSamples = trainingSamples.slice(0, batchSize);
    const trainingTensors = tf.concat(
      batchSamples.map((samples) => samples.features) as Array<tf.Tensor>
    );

    const labelTensors = tf.tensor2d(
      batchSamples.map((sample) => sample.label),
      [batchSamples.length, 1]
    );

    return { trainingTensors, labelTensors };
  };

  return {
    buildTrainingBatch,
  };
};
