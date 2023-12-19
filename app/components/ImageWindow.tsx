import { FC, useState, createRef, RefObject, useEffect } from "react";
import { ImageViewModel } from "../models/ImageViewModel";
import { ImageLikeBtn } from "./ImageLikeBtn";

type ImageWindowProps = {
  imageData: ImageViewModel;
  // emitters
  imageLiked?: (imageData: ImageViewModel, liked: boolean) => any;
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
      if (props.imageLiked) {
        props.imageLiked(props.imageData, newVal);
      }
      props.imageData.setImageLiked(newVal);
      return newVal;
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center relative">
      <div className="flex items-center justify-center h-full">
        <img
          onDoubleClick={handleLike}
          className="object-fill max-h-screen max-w-screen"
          onLoad={(_) => props.onImageLoaded(imageRef, props.imageData)}
          src={props.imageData.source}
          alt={props.imageData.description || "No Description"}
          ref={imageRef}
          crossOrigin="anonymous"
        />
      </div>
      <div className="absolute mx-auto bottom-0 h-[150px]">
        <div className="px-9">
          <div className="space-y-1 flex flex-col">
            <h3 className="font-black text-white text-2xl">
              {props.imageData.username}
            </h3>
            <span className="text-slate-300">
              {props.imageData.description}
            </span>
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
