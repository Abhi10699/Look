import { FC, useState } from "react";
import { SpringButtonBase, SpringButtonBaseProps } from "./SpringBase";

interface SpringNextImageButtonProps extends SpringButtonBaseProps {
  inverted?: boolean;
  training: boolean;
  score: number;
}

export const ModelStatusBtn: FC<SpringNextImageButtonProps> = (props) => {
  const [chatBubbleActive, setChatBubbleActive] = useState(false);

  return (
    <SpringButtonBase
      transition={{
        type: "spring",
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
        easings: ["easeInOut"],
      }}
      onClick={() => setChatBubbleActive(!chatBubbleActive)}
      {...props}
    >
      <span className="text-lg">{props.training ? "👀" : "✨"}</span>
      {chatBubbleActive && (
        <div className="absolute right-9 bottom-5 chat chat-end">
          <div className="flex flex-col chat-bubble text-sm w-60 bg-white text-black cursor-default pointer-events-auto space-y-3">
            {/* Model Status */}
            <span className="font-normal flex flex-col items-start">
              Model Status:{" "}
              <span
                className={`${
                  props.training ? "text-green-500" : "text-yellow-500"
                } font-bold`}
              >
                {props.training ? "Observing.. 👀" : "Evaluating ✨"}
              </span>
            </span>

            {/* Metrics */}

            <span className="flex flex-col items-start space-y-1">
              Score:{" "}
              {props.score > 0 && (
                <>
                  <span className="font-bold">
                    {Number(props.score?.toFixed(4)) * 100}%
                  </span>
                  <span className="text-gray-400 text-xs text-left">
                    The model is good at predicting your prefrence{" "}
                    <b>{Number(props.score?.toFixed(4)) * 100}%</b> of the
                    times.
                  </span>
                </>
              )}
              {props.score == 0 && (
                <span className="text-gray-400 text-xs text-left">
                  Please checkout atleast 15 images to get the evaluation score.
                </span>
              )}
            </span>
            {/*  */}
          </div>
        </div>
      )}
    </SpringButtonBase>
  );
};
