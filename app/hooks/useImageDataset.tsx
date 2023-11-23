import { useState } from "react";
import * as tf from "@tensorflow/tfjs";

type ImageDatasetHookProps = {
  batchSize: number;
};

type ImageTrainingSampleType =
  | tf.Tensor<tf.Rank>
  | tf.Tensor<tf.Rank>[]
  | tf.NamedTensorMap;

export const useImageDataset = (
  props: ImageDatasetHookProps = { batchSize: 10 }
) => {
  const [trainingSamples, setTrainingSamples] = useState<
    Array<ImageTrainingSampleType>
  >([]);
  const [trainingLabels, setTrainingLabels] = useState<Array<number>>([]); // whether the user has liked the image or not
  const [evaluationLabels, setEvaluationLabels] = useState<Array<number>>([]);

  const unsetDataset = () => {
    const inputSamples = new Array(props.batchSize);
    const labels = new Array(props.batchSize).fill(0);
    const evalLabels = new Array(props.batchSize).fill(0);

    setTrainingLabels(labels);
    setTrainingSamples(inputSamples);
    setEvaluationLabels(evalLabels);
  };

  const updateTrainingSample = (
    tensor: ImageTrainingSampleType,
    index: number
  ) => {
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

  const updateEvaluationLabels = (value: number, index: number) => {
    setEvaluationLabels((prevLabels) => {
      const labels = [...prevLabels];
      labels[index] = value;
      return labels;
    });
  };

  const getTrainingData = () => {
    const trainingTensors = tf.concat(trainingSamples as Array<tf.Tensor>);
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
    updateEvaluationLabels,
    unsetDataset,
    evaluationLabels
  };
};
