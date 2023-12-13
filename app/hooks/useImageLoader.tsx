import { useEffect, useState } from "react";
import { IUnsplashImage } from "../api/images/IUnsplashImageHttp";
import { ImageViewModel } from "../models/ImageViewModel";

export const useImageManager = (
  props: { trainingBatchSize: number } = { trainingBatchSize: 10 }
) => {
  const [images, setImages] = useState<Array<ImageViewModel>>([]);
  const [fetchCounter, setFetchCounter] = useState<number>(0);

  const fetchImages = async () => {
    const images = (
      await fetch(`/api/images`, {
        method: "GET",
      })
    ).json();

    const imageArr = (await images) as {
      images: Array<IUnsplashImage>;
      userId: string;
    };

    const imageModels = imageArr.images.map((imageObj) =>
      ImageViewModel.mapFromHttpResponse(imageObj)
    );

    setImages((previous) => [...previous, ...imageModels]);
  };

  const triggerFetch = () => {
    setFetchCounter((previous) => previous + 1);
  };

  const updateArrayField = (cb: (item: ImageViewModel) => ImageViewModel) => {
    setImages((prev) => {
      const newState = prev.map((item) => {
        if (!cb) {
          return item;
        }
        return cb(item);
      });

      return newState;
    });
  };

  const buildTrainingBatch = () => {
    const samples = images.filter((sample) => !sample.imageUsedInTraining);

    if (samples.length < props.trainingBatchSize) {
      throw new Error("Not enough training samples!");
    }

    const trainingSamples = samples.map((sample) => {
      sample.setImageUsedInTraining(true);
      return {
        features: sample.imageFeatureTensor,
        label: Number(sample.imageLiked),
      };
    });

    return trainingSamples.slice(0, props.trainingBatchSize);
  };

  useEffect(() => {
    fetchImages();
  }, [fetchCounter]);

  return {
    triggerFetch,
    images,
    updateArrayField,
    buildTrainingBatch,
  };
};
