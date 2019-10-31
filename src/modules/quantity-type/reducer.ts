import { createReducer, ActionType } from "typesafe-actions";
import * as actions from "./actions";

import { QuantityType } from "astroplant-api";

export interface QuantityTypeState {
  quantityTypes: { [id: string]: QuantityType };
}

const initial: QuantityTypeState = {
  quantityTypes: {}
};

export type QuantityTypeAction = ActionType<typeof actions>;

export default createReducer<QuantityTypeState, QuantityTypeAction>(
  initial
).handleAction(actions.addQuantityTypes, (state, action) => {
  const { quantityTypes, ...rest } = state;

  let newQuantityTypes: { [id: string]: QuantityType } = {};
  for (const def of action.payload) {
    newQuantityTypes[def.id.toString()] = def;
  }

  return { quantityTypes: { ...newQuantityTypes, ...quantityTypes }, ...rest };
});
