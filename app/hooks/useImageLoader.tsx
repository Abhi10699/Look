import { useEffect, useState } from "react";
import { IUnsplashImage } from "../api/images/IUnsplashImageHttp";
import { ImageViewModel } from "../models/ImageViewModel";

export const useImageManager = () => {
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

  useEffect(() => {
    fetchImages();
  }, [fetchCounter]);

  return {
    triggerFetch,
    images,
    updateArrayField,
  };
};
