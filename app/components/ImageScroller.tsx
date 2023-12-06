import { useState, PropsWithChildren, FC, createRef, useEffect } from "react";
import { motion } from "framer-motion";
import { SpringNextImageButton } from "./RoundedButton";

type ImageScrollerProps = {
  childrenLength: number;
};

export const ImageScroller: FC<PropsWithChildren<ImageScrollerProps>> = ({
  children,
  childrenLength,
}) => {
  const [activeElementIndex, setActiveElementIndex] = useState(0);
  const containerRef = createRef<HTMLDivElement>();

  const showNewElement = () => {
    const nextElementIndex = (activeElementIndex + 1) % childrenLength;
    setActiveElementIndex(nextElementIndex);
  };

  const showPreviousElement = () => {
    if (activeElementIndex == 0) {
      setActiveElementIndex(childrenLength);
    } else {
      setActiveElementIndex(activeElementIndex - 1);
    }
  };

  const scrollElementToView = () => {
    const containerChildren = containerRef.current?.children;
    if (!containerChildren) return;
    const nextActiveChildren = containerChildren[activeElementIndex];
    nextActiveChildren.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  useEffect(() => {
    scrollElementToView();
  }, [activeElementIndex]);

  return (
    <div className="relative overflow-hidden max-h-screen" ref={containerRef}>
      {Array.isArray(children) &&
        children.map((elem, idx) => <motion.div>{elem}</motion.div>)}
      <div className="fixed flex flex-row w-screen justify-center items-center my-auto bottom-10 h-fit space-x-5">
        <SpringNextImageButton
          initial={{ y: 10 }}
          animate={{ y: 0 }}
          onClick={showNewElement}
          className="stroke-white border"
        />
        <SpringNextImageButton
          initial={{ y: -10 }}
          animate={{ y: 0 }}
          onClick={showPreviousElement}
          inverted
          className="stroke-white border"
        />
      </div>
    </div>
  );
};
