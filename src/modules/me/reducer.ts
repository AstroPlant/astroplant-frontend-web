import { createReducer, ActionType } from "typesafe-actions";
import * as actions from "./actions";
import Option from "../../utils/option";
import { FullUser, KitMembership } from "astroplant-api";

export interface MeState {
  details: Option<FullUser>;
  loadingKitMemberships: boolean;
  kitMemberships: KitMembership[];
}

const initial: MeState = {
  details: Option.none(),
  loadingKitMemberships: false,
  kitMemberships: []
};

export type MeAction = ActionType<typeof actions>;

export default createReducer<MeState, MeAction>(initial)
  .handleAction(actions.setDetails, (state, action) => {
    return { ...state, details: Option.some(action.payload) };
  })
  .handleAction(actions.setKitMemberships, (state, action) => {
    return { ...state, loadingKitMemberships: false, kitMemberships: action.payload };
  })
  .handleAction(actions.loadingKitMemberships, (state) => {
    return { ...state, loadingKitMemberships: true };
  });
