import { createReducer, ActionType } from "typesafe-actions";
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

export type MeAction = ActionType<typeof actions>;

export default createReducer<MeState, MeAction>(initial)
  .handleAction(actions.setDetails, (state, action) => {
    return { ...state, details: Option.some(action.payload) };
  })
  .handleAction(actions.setKitMemberships, (state, action) => {
    return produce(state, (draft) => {
      for (const { kit, accessConfigure, accessSuper } of action.payload) {
        const membership = { accessConfigure, accessSuper };
        if (
          !(kit.serial in state.kitMemberships) ||
          !isEqual(membership, state.kitMemberships[kit.serial])
        ) {
          draft.kitMemberships[kit.serial] = membership;
        }
        draft.loadingKitMemberships = false;
      }
    });
  })
  .handleAction(actions.loadingKitMemberships, (state) => {
    return { ...state, loadingKitMemberships: true };
  });
