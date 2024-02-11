import { createReducer } from "@reduxjs/toolkit";

import * as actions from "./actions";
import { RootState } from "~/types";

export interface MeState {
  username: string | null;
}

const initial: MeState = {
  username: null,
};

export default createReducer<MeState>(initial, (build) =>
  build.addCase(actions.setUsername, (state, action) => {
    state.username = action.payload;
  }),
);

export const selectMe = (state: RootState) => state.me;
