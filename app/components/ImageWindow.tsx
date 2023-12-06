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
        onDoubleClick={handleLike}
        className="object-fill min-h-fit"
        onLoad={(_) => props.onImageLoaded(imageRef)}
        src={props.source}
        alt={props.description || ""}
        ref={imageRef}
        crossOrigin="anonymous"
      />

      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="red"
        viewBox="0 0 24 24"
        strokeWidth={1}
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg> */}
    </div>
  );
};
