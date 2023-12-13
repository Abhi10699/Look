import { createContext, PropsWithChildren, FC, useReducer } from "react";

interface IModelContext {
  modelTrained: boolean; // flag to check if the model has been trained atleast once
  

}

const ModelContext = createContext<IModelContext>({
  modelTrained: false,
});

const ModelContextProvider: FC<PropsWithChildren> = (props) => {
  // return <ModelContext.Provider>{props.children}</ModelContext.Provider>;
  return <></>;
};
