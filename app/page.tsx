"use client";
import { useState, useEffect } from "react";
import { ImageWindow } from "./components/ImageWindow";
import { IUnsplashImage } from "./api/images/IUnsplashImageHttp";
import * as tf from "@tensorflow/tfjs";

const loadMobileNetModel = async () => {
  const mobileNet = await tf.loadGraphModel(
    "https://www.kaggle.com/models/google/mobilenet-v2/frameworks/TfJs/variations/035-224-feature-vector/versions/3",
    { fromTFHub: true }
  );
  return mobileNet;
};

// core ai hook

type ImageRankerTrainerHookProps = {
  batchSize: number;
};

const useImageDataset = (
  props: ImageRankerTrainerHookProps = { batchSize: 10 }
) => {
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

const useImageLoader = () => {
  const loadImages = async () => {
    const images = (
      await fetch(`/api/images`, {
        method: "GET",
      })
    ).json();

    const imageArr = (await images) as {
      images: Array<IUnsplashImage>;
      userId: string;
    };

    console.log(imageArr.images.length);
    return imageArr.images;
  };

  return {
    loadImages,
  };
};

const useModelTrainer = () => {
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

export default function Home() {
  const [imageList, setImageList] = useState<Array<IUnsplashImage>>([]);
  const [mobileNetModel, setMobileNetModel] = useState<tf.GraphModel>();

  const imageDataset = useImageDataset({ batchSize: 30 });
  const imageLoader = useImageLoader();
  const modelTrainer = useModelTrainer();

  const initApp = async () => {
    if (!mobileNetModel) {
      const featureExtractorModel = await loadMobileNetModel();
      setMobileNetModel(featureExtractorModel);
    }

    // load images
    const images = await imageLoader.loadImages();
    setImageList(images);

    // setup database
    imageDataset.unsetDataset();

    // setup model
    modelTrainer.loadModel();
  };

  const fitModel = async () => {
    const { labelTensors, trainingTensors } = imageDataset.getTrainingData();
    const history = await modelTrainer.fitModel(trainingTensors, labelTensors);
    console.log(history);
  };

  useEffect(() => {
    initApp();
  }, []);

  if (!mobileNetModel) {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      {imageList.map((data, index) => (
        <ImageWindow
          key={index}
          source={data.urls.small}
          description={data.description}
          featureExtractor={mobileNetModel}
          featuresExtracted={(feature) =>
            imageDataset.updateTrainingSample(feature, index)
          }
          predictionModel={modelTrainer.rankerModel}
          imageLiked={(value) =>
            imageDataset.updateTrainingLabels(value, index)
          }
        />
      ))}

      <button onClick={fitModel}>Train</button>
    </div>
  );
}
