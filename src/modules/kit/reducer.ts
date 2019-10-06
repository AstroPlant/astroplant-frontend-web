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
  kits: {[serial: string]: KitState};
}

const initial: KitsState = {
  // Kits must be added first by addKit, so will never be uninitialized.
  kits: {}
};

export type KitAction = ActionType<typeof actions>;

const kitReducer = createReducer<KitState, KitAction>({} as any)
  .handleAction(actions.addKit, (state, action) => {
    return { ...action.payload, realTime: {} };
  });

const kitReducerById = byId((action: any) => (action.payload || {}).serial, kitReducer as any);

export default function(state = initial, action: any) {
  const { kits, ...otherState } = state;
  const newKits = kitReducerById(kits, action) as any;

  return { kits: newKits, ...otherState };
}
