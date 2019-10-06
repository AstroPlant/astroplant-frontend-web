import { createReducer, ActionType } from "typesafe-actions";
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
  kitMemberships: {[serial: string]: KitMembership};
}


const initial: MeState = {
  details: Option.none(),
  loadingKitMemberships: false,
  kitMemberships: {}
};

export type MeAction = ActionType<typeof actions>;

export default createReducer<MeState, MeAction>(initial)
  .handleAction(actions.setDetails, (state, action) => {
    return { ...state, details: Option.some(action.payload) };
  })
  .handleAction(actions.setKitMemberships, (state, action) => {
    let kitMemberships: {[serial: string]: KitMembership} = {};
    for (const { kit, accessConfigure, accessSuper } of action.payload) {
      kitMemberships[kit.serial] = { accessConfigure, accessSuper };
    }
    return { ...state, loadingKitMemberships: false, kitMemberships };
  })
  .handleAction(actions.loadingKitMemberships, (state) => {
    return { ...state, loadingKitMemberships: true };
  });
