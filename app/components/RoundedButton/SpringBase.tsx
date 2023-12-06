import { ButtonHTMLAttributes, FC, PropsWithChildren } from "react";
import { RoundedButtonBaseMotion } from "./Base";
import { MotionProps } from "framer-motion";

export type SpringButtonBaseProps = ButtonHTMLAttributes<HTMLButtonElement> &
  MotionProps;

export const SpringButtonBase: FC<any> = (props) => {
  return (
    <RoundedButtonBaseMotion
      transition={{
        type: "spring",
        repeat: Infinity,
        repeatType: "reverse",
        duration: 1,
        easings: ["easeInOut"],
      }}
      {...props}
    >
      {props.children}
    </RoundedButtonBaseMotion>
  );
};
