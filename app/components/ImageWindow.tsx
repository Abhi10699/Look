import { FC, useState, createRef, RefObject } from "react";
import { ImageViewModel } from "../models/ImageViewModel";
import { ImageLikeBtn } from "./ImageLikeBtn";

type ImageWindowProps = {
  imageData: ImageViewModel;
  // emitters
  imageLiked: (imageData: ImageViewModel, liked: boolean) => any;
  onImageLoaded: (
    imageRef: RefObject<HTMLImageElement>,
    imagData: ImageViewModel
  ) => any;
};

export const ImageWindow: FC<ImageWindowProps> = (props) => {
  const [liked, setLiked] = useState(false);
  const imageRef = createRef<HTMLImageElement>();

  const handleLike = () => {
    setLiked((previous) => {
      const newVal = !previous;
      props.imageLiked(props.imageData, newVal);
      return newVal;
    });
  };

  return (
    <div className="h-screen bg-black flex flex-col justify-center relative">
      <img
        onDoubleClick={handleLike}
        className="object-fill min-h-fit"
        onLoad={(_) => props.onImageLoaded(imageRef, props.imageData)}
        src={props.imageData.source}
        alt={props.imageData.description || ""}
        ref={imageRef}
        crossOrigin="anonymous"
      />
      <div className="absolute bottom-0 w-screen h-[210px] bg-gradient-to-t from-[rgba(0,0,0,0.64)] to-transparent">
        <div className="px-9 mt-16">
          <div className="space-y-1 flex flex-col">
            <h3 className="font-black text-white text-2xl">
              {props.imageData.username}
            </h3>
            <span className="text-slate-300">#toronto #city #skyline</span>
          </div>
          <ImageLikeBtn
            onClick={handleLike}
            liked={liked}
            likepredicted={props.imageData.likePredicted}
          />
        </div>
      </div>
    </div>
  );
};
