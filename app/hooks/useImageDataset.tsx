import { useState } from "react";
import * as tf from "@tensorflow/tfjs";

type ImageDatasetHookProps = {
  batchSize: number;
};

export const useImageDataset = (props: ImageDatasetHookProps = { batchSize: 10 }) => {
  const [trainingSamples, setTrainingSamples] = useState<Array<tf.Tensor>>([]);
  const [trainingLabels, setTrainingLabels] = useState<Array<number>>([]); // whether the user has liked the image or not

  const unsetDataset = () => {
    const inputSamples = new Array(props.batchSize);
    const labels = new Array(props.batchSize).fill(0); // not liked by default

    setTrainingLabels(labels);
    setTrainingSamples(inputSamples);
  };

  const updateTrainingSample = (tensor: tf.Tensor, index: number) => {
    setTrainingSamples((prevSamples) => {
      const samples = [...prevSamples];
      samples[index] = tensor;
      return samples;
    });
  };

  const updateTrainingLabels = (value: number, index: number) => {
    setTrainingLabels((prevLabels) => {
      const labels = [...prevLabels];
      labels[index] = value;
      return labels;
    });
  };

  const getTrainingData = () => {
    console.log(trainingSamples);
    console.log(trainingLabels);

    const trainingTensors = tf.concat(trainingSamples);
    const labelTensors = tf.tensor2d(trainingLabels, [
      trainingLabels.length,
      1,
    ]);
    return { trainingTensors, labelTensors };
  };

  return {
    getTrainingData,
    updateTrainingLabels,
    updateTrainingSample,
    unsetDataset,
  };
};
