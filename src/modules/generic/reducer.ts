import { createReducer } from "@reduxjs/toolkit";
import * as actions from "./actions";

export interface GenericState {
  apiConnectionFailed: boolean;
}

const initial: GenericState = {
  apiConnectionFailed: false,
};

export default createReducer<GenericState>(initial, (builder) =>
  builder.addCase(actions.setApiConnectionFailed, (state, action) => {
    state.apiConnectionFailed = action.payload;
  })
);
