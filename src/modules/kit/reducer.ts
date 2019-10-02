import { createReducer, ActionType } from "typesafe-actions";
import * as actions from "./actions";
import Option from "utils/option";
import { byId } from "utils/byId";

import { Kit } from "astroplant-api";


export interface Measurement {
  physicalQuantity: string;
  physicalUnit: string;
  value: number;
}

export interface KitState extends Kit {
  realTime: {
    [key: string]: Measurement;
  };
}

export interface KitsState {
  [serial: string]: KitState;
}

// Kits must be added first by addKit, so will never be uninitialized.
const initial: any = {};

export type KitAction = ActionType<typeof actions>;

const kitReducer = createReducer<KitState, KitAction>(initial)
  .handleAction(actions.addKit, (state, action) => {
    return { ...action.payload, realTime: {} };
  });

export default byId((action: any) => (action.payload || {}).serial, kitReducer as any);
