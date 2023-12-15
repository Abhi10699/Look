"use client";

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
  modelOverallTrainingCount: number;
  modelScore: number;
  modelRefreshCounter: number;
}

type action = {
  type: string;
  payload?: any;
};

const defaultContext: IModelContext = {
  modelEvents: [],
  modelInTrainingMode: true,
  modelOverallTrainingCount: 0,
  modelScore: 0,
  modelRefreshCounter: 0,
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
    // MODEL
    case "SET_MODEL_MODE_TRAINING":
      return { ...state, modelInTrainingMode: true };

    case "SET_MODEL_MODE_INFERENCE":
      return { ...state, modelInTrainingMode: false };

    // TRAINING COUNT
    case "SET_MODEL_TRAINING_COUNT":
      return { ...state, modelOverallTrainingCount: action.payload?.count };

    case "INCREMENT_MODEL_TRAINING_COUNT":
      return {
        ...state,
        modelOverallTrainingCount: state.modelOverallTrainingCount + 1,
      };

    case "INCREMENT_MODEL_REFRESH_COUNTER":
      return {
        ...state,
        modelRefreshCounter: state.modelRefreshCounter + 1,
      };

    // SCORE
    case "SET_MODEL_SCORE":
      return { ...state, modelScore: action.payload?.score };

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
