import { FC, useState, useRef, createRef, useEffect } from "react";
import type { GraphModel, LayersModel, Tensor, Rank } from "@tensorflow/tfjs";
import * as tf from "@tensorflow/tfjs";

type ImageWindowProps = {
  source: string;
  description?: string;
  createdAt?: string;
  featureExtractor: GraphModel;
  predictionModel: LayersModel;

  // emitters
  featuresExtracted: (features: Tensor<Rank>) => any;
  imageLiked: (value: number) => any;
};

export const ImageWindow: FC<ImageWindowProps> = (props) => {
  const [liked, setLiked] = useState(false);
  const [likePredicted, setLikePredicted] = useState(false);

  const imageRef = createRef<HTMLImageElement>();

  const extractFeatures = async () => {
    if (!imageRef.current) {
      return;
    }
    const imageTensor = await tf.browser.fromPixels(imageRef.current).toFloat();
    const resizedImage = tf.image
      .resizeBilinear(imageTensor, [224, 224])
      .expandDims();

    const mobilenetPrediction = await props.featureExtractor.predict(
      resizedImage
    );

    return mobilenetPrediction;
  };

  const handleImageLoad = async () => {
    const imageFeatures = await extractFeatures();
    const modelPrediction = props.predictionModel.predict(
      imageFeatures
    ) as tf.Tensor;
    const probablity = await modelPrediction.data();

    if (probablity[0] > 0.5) {
      setLikePredicted(true);
    }

    props.featuresExtracted(imageFeatures);
  };

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
        onLoad={handleImageLoad}
        src={props.source}
        alt={props.description || ""}
        ref={imageRef}
        crossOrigin="anonymous"
      />
      <p className={`${likePredicted ? 'text-green-600' : 'text-red-500'}`}>{
        likePredicted ? "You will 💖 the Image" : "You will Not Like this Image"
      }</p>
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
