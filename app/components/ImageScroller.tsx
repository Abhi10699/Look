import { useState, PropsWithChildren, FC, createRef } from "react";
import { motion } from "framer-motion";

export const ImageScroller: FC<PropsWithChildren> = ({ children }) => {
  const [activeElementIndex, setActiveElementIndex] = useState(0);
  const containerRef = createRef<HTMLDivElement>();

  const showNewElement = () => {
    const containerChildren = containerRef.current?.children;
    if (!containerChildren) {
      return;
    }
    let nextElementIndex = (activeElementIndex + 1) % containerChildren.length;

    const nextActiveChildren = containerChildren[nextElementIndex];
    nextActiveChildren.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setActiveElementIndex(nextElementIndex);
  };

  return (
    <div className="relative overflow-hidden max-h-screen" ref={containerRef}>
      {Array.isArray(children) &&
        children.map((elem, idx) => <motion.div>{elem}</motion.div>)}
      <motion.button
        initial={{
          y: 10,
        }}
        animate={{
          y: 0,
        }}
        transition={{
          type: "spring",
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1,
          easings: ["easeInOut"],
        }}
        onClick={showNewElement}
        style={{border: "0.6px solid rgba(255, 255, 255, 0.5)"}}
        className="
          cursor-pointer
          fixed w-fit mx-auto p-3
          bottom-10 left-0 right-0 
          bg-black text-white text-center 
          rounded-full">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 17.25L12 21m0 0l-3.75-3.75M12 21V3"
          />
        </svg>
      </motion.button>
    </div>
  );
};
