import { useRef, useEffect } from "react";

type useWebWorkerProps = {
  recieveMessage: (data: any) => void;
};

export const useWebWorker = (props: useWebWorkerProps) => {
  const workerRef = useRef<Worker>();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("../workers/model.worker.js", import.meta.url)
    );
    workerRef.current.onmessage = (data) => props.recieveMessage(data);
    return () => {
      workerRef.current?.terminate();
    };
  }, []);

  const postMessage = (message: any) => {
    workerRef.current?.postMessage(message);
  };

  return { postMessage };
};
