import { forwardRef, PropsWithChildren, ButtonHTMLAttributes } from "react";
import { MotionProps, motion } from "framer-motion";

export interface RoundedButtonBaseProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  extraClasses?: string;
}

export const RoundedButtonBase = forwardRef<
  HTMLButtonElement,
  RoundedButtonBaseProps
>((props, ref) => (
  <button
    ref={ref}
    className={`cursor-pointer w-fit p-3 bg-black text-white text-center rounded-full shadow-lg stroke-white border ${props.extraClasses}`}
    {...props}
  >
    {props.children}
  </button>
));

export const RoundedButtonBaseMotion = motion(RoundedButtonBase);
