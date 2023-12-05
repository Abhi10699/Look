import {
  useState,
  PropsWithChildren,
  FC,
  useRef,
  createRef,
  useEffect,
} from "react";
import { motion } from "framer-motion";

export const ImageScroller: FC<PropsWithChildren> = ({ children }) => {
  const [activeElementIndex, setActiveElementIndex] = useState(0);
  const containerRef = createRef<HTMLDivElement>();

  const showNewElement = () => {
    // get children

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
      <button onClick={showNewElement} className="fixed top-0">
        Next
      </button>
    </div>
  );
};
