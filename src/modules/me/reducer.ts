import { createReducer } from "@reduxjs/toolkit";
import produce from "immer";
import isEqual from "lodash/isEqual";
import * as actions from "./actions";
import Option from "../../utils/option";
import { FullUser } from "astroplant-api";

export interface KitMembership {
  accessConfigure: boolean;
  accessSuper: boolean;
}

export interface MeState {
  details: Option<FullUser>;
  loadingKitMemberships: boolean;
  kitMemberships: { [serial: string]: KitMembership };
}

const initial: MeState = {
  details: Option.none(),
  loadingKitMemberships: false,
  kitMemberships: {},
};

export default createReducer<MeState>(initial, (build) =>
  build
    .addCase(actions.setDetails, (state, action) => {
      state.details = Option.some(action.payload);
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
);
