import { FC, useState, createRef, RefObject } from "react";
import { HeartButton } from "./RoundedButton/HeartButton";
import { IUnsplashImage } from "../api/images/IUnsplashImageHttp";

type ImageWindowProps = {
  imageData: IUnsplashImage;
  // emitters
  imageLiked: (value: number) => any;
  onImageLoaded: (imageRef: RefObject<HTMLImageElement>) => any;
};

export const ImageWindow: FC<ImageWindowProps> = (props) => {
  const [liked, setLiked] = useState(false);
  const imageRef = createRef<HTMLImageElement>();

  const handleLike = () => {
    setLiked((previous) => {
      const newVal = !previous;
      props.imageLiked(Number(newVal));
      return newVal;
    });
  };

  return (
    <div className="h-screen bg-black flex flex-col justify-center relative">
      <img
        onDoubleClick={handleLike}
        className="object-fill min-h-fit"
        onLoad={(_) => props.onImageLoaded(imageRef)}
        src={props.imageData.urls.regular}
        alt={props.imageData.description || ""}
        ref={imageRef}
        crossOrigin="anonymous"
      />
      <div className="absolute bottom-0 w-screen h-[210px] bg-gradient-to-t from-[rgba(0,0,0,0.64)] to-transparent">
        <div className="px-9 mt-16">
          <div className="space-y-1 flex flex-col">
            <h3 className="font-black text-white text-2xl">{props.imageData.user.name}</h3>
            <span className="text-slate-300">#toronto #city #skyline</span>
          </div>
          <button className="mt-3 text-white w-fit border-2 stroke-white rounded-[8px] px-7 py-2 font-black text-[16px]">
            Like
          </button>
        </div>
      </div>
    </div>
  );
};
