import { FC, forwardRef, PropsWithChildren } from "react";
import { motion, MotionProps } from "framer-motion";

interface RoundedButtonProps {
  animated?: boolean;
  onClick?: () => any;
  className?: string;
}

const baseButtonStyles = `cursor-pointer
fixed w-fit p-3 
bg-black text-white text-center 
rounded-full`;

const RoundedButtonBase = forwardRef<
  HTMLButtonElement,
  PropsWithChildren<RoundedButtonProps>
>((props, ref) => (
  <button
    ref={ref}
    className={`cursor-pointer w-fit p-3 bg-black text-white text-center rounded-full ${props.className}`}
    onClick={props.onClick}
  >
    {props.children}
  </button>
));

const RoundedButtonMotion = motion(RoundedButtonBase);

// spring animated next button

interface SpringNextImageButtonProps extends RoundedButtonProps, MotionProps {
  inverted?: boolean;
}

export const SpringNextImageButton: FC<SpringNextImageButtonProps> = (
  props
) => {
  return (
    <RoundedButtonMotion
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
    </RoundedButtonMotion>
  );
};
