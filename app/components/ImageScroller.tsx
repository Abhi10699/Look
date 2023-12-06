import { useState, PropsWithChildren, FC, createRef, useEffect } from "react";
import { ArrowButton } from "./RoundedButton/ArrowButton";
import { HeartButton } from "./RoundedButton/HeartButton";

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

  if (!Array.isArray(children)) {
    throw new Error("Expected a Scrollable Children");
  }
  return (
    <div className="relative overflow-hidden max-h-screen" ref={containerRef}>
      {children.map((elem) => elem)}
      <div className="fixed flex flex-col w-screen justify-center items-end my-auto bottom-10 h-fit space-y-3 px-8">
        <ArrowButton
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          onClick={showPreviousElement}
          inverted
        />
        <ArrowButton
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          onClick={showNewElement}
        />
      </div>
    </div>
  );
};
