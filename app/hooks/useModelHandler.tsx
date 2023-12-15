import { useRef, useEffect, useState, useMemo, useContext } from "react";
import { ImageRankingModel } from "../ml-models/ImageRankerModel";
import { Tensor, tensor } from "@tensorflow/tfjs";
import { ModelContext } from "../context/ModelContext";

/*

0. This hook is responsible for registering the webworker and handling the events from it.

1. This hook should take care of handling 
the model state between the main thread 
and the worker thread.


2. It should take care of loading the weights

3. It should take care of doing the predictions

4. It should take of sending the state to the frontend aswell


*/
export const useModelHandler = () => {
  const rankerModel = useMemo(() => new ImageRankingModel(), []);
  const workerRef = useRef<Worker>();
  const { state, dispatch } = useContext(ModelContext);

  const messageHandler = (
    event: MessageEvent<{ type: string; data?: any }>
  ) => {
    const { data: message } = event;
    if (message.type == "TRAIN_COMPLETE") {
      dispatch({ type: "INCREMENT_MODEL_REFRESH_COUNTER" });
    }
  };

  // registering the webworker
  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/model.worker.js", import.meta.url)
    );
    workerRef.current.onmessage = (e) => messageHandler(e);

    // get model training count from localstorage

    const trainingCount =
      Number(localStorage.getItem("modelOverallTrainingCount")) || 0;

    dispatch({
      type: "SET_MODEL_TRAINING_COUNT",
      payload: { count: trainingCount },
    });

    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  // do predictions on main thread..

  const predict = async (
    imageFeatures: Float32Array | Uint8Array | Int32Array
  ) => {
    const inputTensor = tensor(imageFeatures, [1, 1280]);
    const predictionLogits = rankerModel.model.predict(inputTensor) as Tensor;
    const predictionResult = await predictionLogits.data();
    return predictionResult;
  };

  const train = (
    trainingSamples: {
      features: Float32Array | Uint8Array | Int32Array;
      label: number;
    }[]
  ) => {
    workerRef.current?.postMessage({
      request: "TRAIN_MODEL",
      trainingSamples,
    });

    // increment count

    dispatch({
      type: "INCREMENT_MODEL_TRAINING_COUNT",
    });
  };
  return { predict, train };
};
