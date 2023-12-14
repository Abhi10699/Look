"use client"

import {
  createContext,
  PropsWithChildren,
  FC,
  useReducer,
  Dispatch,
} from "react";

interface IModelContext {
  modelEvents: any[];
  modelInTrainingMode: boolean;
}

type action = {
  type: string;
  payload?: any;
};

const defaultContext = {
  modelEvents: [],
  modelInTrainingMode: false,
};

export const ModelContext = createContext<{
  state: IModelContext;
  dispatch: Dispatch<{ type: string; payload?: any }>;
}>({
  state: defaultContext,
  dispatch: () => null,
});

// actions

function modelContextReducer(
  state: IModelContext,
  action: action
): IModelContext {
  switch (action.type) {
    case "SET_MODEL_MODE_TRAINING":
      return { ...state, modelInTrainingMode: true };

    case "SET_MODEL_MODE_INFERENCE":
      return { ...state, modelInTrainingMode: false };

    default:
      return state;
  }
}

export const ModelContextProvider: FC<PropsWithChildren> = (props) => {
  const [state, dispatch] = useReducer(modelContextReducer, defaultContext);

  return (
    <ModelContext.Provider value={{ state, dispatch }}>
      {props.children}
    </ModelContext.Provider>
  );
};
