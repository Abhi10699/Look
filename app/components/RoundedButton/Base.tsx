import { forwardRef, ButtonHTMLAttributes } from "react";
import { motion } from "framer-motion";

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
    className={`relative cursor-pointer w-fit p-3  text-white text-center rounded-[18px] shadow-lg stroke-white border-2 ${props.extraClasses}`}
    {...props}
  >
    {props.children}
  </button>
));

export const RoundedButtonBaseMotion = motion(RoundedButtonBase);
