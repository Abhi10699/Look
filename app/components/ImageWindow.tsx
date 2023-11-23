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
    <div className="aspect-square">
      <img
        onLoad={(_) => props.onImageLoaded(imageRef)}
        src={props.source}
        alt={props.description || ""}
        ref={imageRef}
        crossOrigin="anonymous"
      />
      {/* <p className={`${likePredicted ? "text-green-600" : "text-red-500"}`}>
        {likePredicted
          ? "You will 💖 the Image"
          : "You will Not Like this Image"}
      </p> */}
      <button
        onClick={handleLike}
        className={`w-auto px-2 py-1 rounded-sm text-white ${
          !liked ? "bg-blue-600" : "bg-red-600"
        }`}
      >
        {!liked ? "Like" : "Unlike"}
      </button>
    </div>
  );
};
