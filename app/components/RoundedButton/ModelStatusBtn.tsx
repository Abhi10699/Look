import { FC, useState } from "react";
import { SpringButtonBase, SpringButtonBaseProps } from "./SpringBase";

interface SpringNextImageButtonProps extends SpringButtonBaseProps {
  inverted?: boolean;
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
      {...props}
    >
      <span className="text-lg">🤖</span>
      {chatBubbleActive && (
        <div className="absolute right-9 bottom-5 chat chat-end">
          <div className="chat-bubble w-56 bg-white text-black">
            Look.ai thinks You will ❤️ this Picture
            {/* Beep.. Boop.. I'm Training  */}
          </div>
        </div>
      )}
    </SpringButtonBase>
  );
};
