import { createReducer, ActionType } from "typesafe-actions";
import * as actions from "./actions";

export interface GenericState {
  apiConnectionFailed: boolean;
}

const initial: GenericState = {
  apiConnectionFailed: false
};

export type GenericAction = ActionType<typeof actions>;

export default createReducer<GenericState, GenericAction>(initial).handleAction(
  actions.setApiConnectionFailed,
  (state, action) => {
    return { ...state, apiConnectionFailed: action.payload };
  }
);
