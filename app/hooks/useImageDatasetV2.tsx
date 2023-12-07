import { useState } from "react";
import * as tf from "@tensorflow/tfjs";

type ImageExtractedFeatureTensorType =
  | tf.Tensor<tf.Rank>
  | tf.Tensor<tf.Rank>[]
  | tf.NamedTensorMap;

type ImageDatasetTrainingSample<T> = {
  uuid: string;
  feature: ImageExtractedFeatureTensorType;
  label: T;
  usedInTraining?: boolean;
};

export type ImageTrainingSample = ImageDatasetTrainingSample<boolean>;

export const useImageDatasetV2 = () => {
  const [trainingSamples, setTrainingSamples] = useState<ImageTrainingSample[]>(
    []
  );

  const [trainingSampleIds, setTrainingSampleIds] = useState<{
    [sampleId: string]: boolean;
  }>({});

  const [lastBatchIndex, setLastBatchIndex] = useState<number>(0);

  const addTrainingSample = (trainingSample: ImageTrainingSample) => {
    // dealing with duplicates...
    if (trainingSampleExists(trainingSample.uuid)) {
      return;
    }

    setTrainingSamples((previous) => [...previous, trainingSample]);
    setTrainingSampleIds((oldSamples) => ({
      ...oldSamples,
      [trainingSample.uuid]: true,
    }));
  };

  const trainingSampleExists = (sampleId: string) => {
    return sampleId in trainingSampleIds;
  };

  const updateTrainingSample = (sampleId: string, label: boolean) => {
    setTrainingSamples((previous) => {
      const trainingSample = previous.find((sample) => sample.uuid == sampleId);
      if (trainingSample) {
        trainingSample.label = label;
      }
      return previous;
    });
  };

  const buildTrainingBatch = (batchSize = 100) => {
    const newSamples = trainingSamples
      .filter((sample) => !sample.usedInTraining)
      .map((sample) => ({ features: sample.feature, label: sample.label }));

    const batchSamples = newSamples.slice(lastBatchIndex, batchSize);
    const trainingTensors = tf.concat(
      batchSamples.map((samples) => samples.features) as Array<tf.Tensor>
    );

    const labelTensors = tf.tensor2d(
      batchSamples.map((sample) => sample.label),
      [batchSamples.length, 1]
    );

    setLastBatchIndex(lastBatchIndex + batchSize);

    return { trainingTensors, labelTensors };
  };

  return {
    trainingSamples,
    addTrainingSample,
    buildTrainingBatch,
    trainingSampleExists,
    updateTrainingSample,
  };
};
