import { createReducer } from "@reduxjs/toolkit";
import * as actions from "./actions";

import { QuantityType } from "astroplant-api";

export interface QuantityTypeState {
  quantityTypes: { [id: string]: QuantityType };
}

const initial: QuantityTypeState = {
  quantityTypes: {},
};

export default createReducer<QuantityTypeState>(initial, (build) =>
  build.addCase(actions.addQuantityTypes, (state, action) => {
    for (const def of action.payload) {
      state.quantityTypes[def.id.toString()] = def;
    }
  })
);
