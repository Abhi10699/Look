import { FC } from "react";
import { SpringButtonBase, SpringButtonBaseProps } from "./SpringBase";

interface SpringNextImageButtonProps extends SpringButtonBaseProps {
  inverted?: boolean;
}

export const ArrowButton: FC<SpringNextImageButtonProps> = (props) => { 
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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className={`w-6 h-6 ${props.inverted ? "rotate-180" : "rotate-0"}`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3"
        />
      </svg>
    </SpringButtonBase>
  );
};