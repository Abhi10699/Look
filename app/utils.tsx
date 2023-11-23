import * as tf from '@tensorflow/tfjs';

export const JSONResponse = (data: any) => {
  return JSON.stringify(data);
}

export const loadMobileNetModel = async () => {
  const mobileNet = await tf.loadGraphModel(
    "https://www.kaggle.com/models/google/mobilenet-v2/frameworks/TfJs/variations/035-224-feature-vector/versions/3",
    { fromTFHub: true }
  );
  return mobileNet;
};
