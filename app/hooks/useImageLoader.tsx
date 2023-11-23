import { IUnsplashImage } from "../api/images/IUnsplashImageHttp";

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

    return imageArr.images;
  };

  return {
    loadImages,
  };
};
