import { createReducer } from "@reduxjs/toolkit";
import isEqual from "lodash/isEqual";

import * as actions from "./actions";
import * as kitActions from "../kit/actions";
import { RootState } from "~/types";

export interface KitMembership {
  accessConfigure: boolean;
  accessSuper: boolean;
}

export interface MeState {
  username: string | null;
  loadingKitMemberships: boolean;
  kitMemberships: { [serial: string]: KitMembership };
}

const initial: MeState = {
  username: null,
  loadingKitMemberships: false,
  kitMemberships: {},
};

export default createReducer<MeState>(initial, (build) =>
  build
    .addCase(actions.setUsername, (state, action) => {
      state.username = action.payload;
    })
    .addCase(actions.setKitMemberships, (state, action) => {
      // TODO delete membership no longer in payload
      for (const { kit, accessConfigure, accessSuper } of action.payload) {
        const membership = { accessConfigure, accessSuper };
        if (
          !(kit.serial in state.kitMemberships) ||
          !isEqual(membership, state.kitMemberships[kit.serial])
        ) {
          state.kitMemberships[kit.serial] = membership;
        }
      }
      state.loadingKitMemberships = false;
    })
    .addCase(actions.loadingKitMemberships, (state) => {
      state.loadingKitMemberships = true;
    })
    .addCase(kitActions.deleteKit, (state, action) => {
      if (action.payload.serial in state.kitMemberships) {
        delete state.kitMemberships[action.payload.serial];
      }
    }),
);

export const selectMe = (state: RootState) => state.me;
