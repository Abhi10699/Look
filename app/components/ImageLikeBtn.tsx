import React, { ButtonHTMLAttributes, FC } from "react";
import { motion } from "framer-motion";

interface ImageLikeBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  likepredicted?: boolean;
  liked: boolean;
}

export const ImageLikeBtn: FC<ImageLikeBtnProps> = (props) => {
  return (
    <button
      {...props}
      className={`relative mt-3 h-auto w-fit px-7 py-2
        text-white font-black text-[16px]
        border-2 ${
          props.likepredicted && !props.liked
            ? "border-yellow-400"
            : "stroke-white"
        }  rounded-[8px] transition-all
        `}
    >
      {props.likepredicted && !props.liked && (
        <motion.span
          transition={{
            type: "tween",
            repeat: Infinity,
            repeatType: "reverse",
            duration: 0.8,
            easings: ["easeInOut"],
          }}
          initial={{ scale: 1 }}
          animate={{ scale: 1.3 }}
          className="absolute -top-4 -right-3 text-2xl"
        >
          ✨
        </motion.span>
      )}
      {props.liked ? "Dislike" : "Like"}
    </button>
  );
};
