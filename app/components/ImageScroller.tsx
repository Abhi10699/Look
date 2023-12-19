import {
  useState,
  PropsWithChildren,
  FC,
  createRef,
  useEffect,
  useContext,
} from "react";
import { ArrowButton } from "./RoundedButton/ArrowButton";
import { ModelStatusBtn } from "./RoundedButton/ModelStatusBtn";
import { ModelContext } from "../context/ModelContext";

export type ScrollListenerPayload = {
  activeElement: number;
  visitedLog: Array<number>;
};

type ImageScrollerProps = {
  childrenLength: number;
  scrollListener?: (payload: ScrollListenerPayload) => void;
};

export const ImageScroller: FC<PropsWithChildren<ImageScrollerProps>> = ({
  children,
  childrenLength,
  scrollListener,
}) => {
  const [activeElementIndex, setActiveElementIndex] = useState(0);
  const [scrollTracker, setScrollTracker] = useState(() => {
    const arr = new Array(childrenLength).fill(0);
    arr[0] = 1;
    return arr;
  });

  const containerRef = createRef<HTMLDivElement>();

  const { state } = useContext(ModelContext);

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

    // update scroll tracker
    markElementAsVisited(activeElementIndex);
  };

  const markElementAsVisited = (newIndex: number) => {
    const scrollTrackerCpy = [...scrollTracker];
    scrollTrackerCpy[newIndex] = 1;
    setScrollTracker(scrollTrackerCpy);
  };

  useEffect(() => {
    scrollElementToView();
    if (scrollListener != undefined) {
      scrollListener({
        activeElement: activeElementIndex,
        visitedLog: scrollTracker,
      });
    }
  }, [activeElementIndex]);

  if (!Array.isArray(children)) {
    throw new Error("Expected a Scrollable Children");
  }
  return (
    <div className="relative overflow-hidden max-h-screen" ref={containerRef}>
      {children.map((elem) => elem)}
      <div className="sticky flex flex-col w-100 justify-center items-end my-auto bottom-10 h-fit space-y-10 px-8">
        <ModelStatusBtn
          modelTrainCount={state.modelOverallTrainingCount}
          training={state.modelInTrainingMode}
          score={state.modelScore}
        />
        <ArrowButton
          disabled={activeElementIndex == 0}
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          onClick={showPreviousElement}
          inverted={true}
        />
        <ArrowButton
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          onClick={showNewElement}
          inverted={false}
        />
      </div>
    </div>
  );
};
