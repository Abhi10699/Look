import { FC, useState, createRef, RefObject } from "react";

type ImageWindowProps = {
  source: string;
  description?: string;
  createdAt?: string;

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
    <div className="h-screen bg-black flex flex-col justify-center">
      <img
        onDoubleClick={e => alert("Double tap")}
        className="aspect-auto min-h-fit"
        onLoad={(_) => props.onImageLoaded(imageRef)}
        src={props.source}
        alt={props.description || ""}
        ref={imageRef}
        crossOrigin="anonymous"
      />
    </div>
  );
};
