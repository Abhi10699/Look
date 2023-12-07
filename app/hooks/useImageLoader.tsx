import { IUnsplashImage } from "../api/images/IUnsplashImageHttp";
import { ImageViewModel } from "../models/ImageViewModel";

export const useImageLoader = () => {
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

    return imageArr.images.map((imageObj) =>
      ImageViewModel.mapFromHttpResponse(imageObj)
    );
  };

  return {
    loadImages,
  };
};
