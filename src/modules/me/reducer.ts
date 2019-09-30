import { createReducer, ActionType } from "typesafe-actions";
import * as actions from "./actions";
import Option from "../../utils/option";
import { FullUser, KitMembership } from "../../api/api";

export interface MeState {
  details: Option<FullUser>;
  kitMemberships: KitMembership[];
}

const initial: MeState = {
  details: Option.none(),
  kitMemberships: []
};

export type MeAction = ActionType<typeof actions>;

export default createReducer<MeState, MeAction>(initial)
  .handleAction(actions.setDetails, (state, action) => {
    return { ...state, details: Option.some(action.payload) };
  })
  .handleAction(actions.setKitMemberships, (state, action) => {
    return { ...state, kitMemberships: action.payload };
  });
