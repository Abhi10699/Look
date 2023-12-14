import { FC, useState } from "react";
import { SpringButtonBase, SpringButtonBaseProps } from "./SpringBase";

interface SpringNextImageButtonProps extends SpringButtonBaseProps {
  inverted?: boolean;
  training: boolean;
}

export const ModelStatusBtn: FC<SpringNextImageButtonProps> = (props) => {
  const [chatBubbleActive, setChatBubbleActive] = useState(true);

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
      <span className="text-lg">🤖</span>
      {chatBubbleActive && (
        <div className="absolute right-9 bottom-5 chat chat-end">
          <div className="flex flex-col chat-bubble text-sm w-56 bg-white text-black cursor-default pointer-events-auto">
            <span>
              Model Status:{" "}
              <span
                className={`${
                  props.training ? "text-red-500" : "text-green-500"
                }`}
              >
                {props.training ? "Training" : "Predicting"}
              </span>
            </span>

            {props.training && (
              <progress className="progress progress-success w-100"></progress>
            )}
          </div>
        </div>
      )}
    </SpringButtonBase>
  );
};
