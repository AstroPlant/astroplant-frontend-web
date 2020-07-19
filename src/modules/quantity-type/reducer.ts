import { createReducer, createEntityAdapter } from "@reduxjs/toolkit";
import * as actions from "./actions";
import { RootState } from "types";

import { QuantityType } from "astroplant-api";

export const quantityTypesAdapter = createEntityAdapter<QuantityType>({
  selectId: (quantityType) => quantityType.id,
});

export default createReducer(
  { types: quantityTypesAdapter.getInitialState() },
  (build) =>
    build.addCase(actions.addQuantityTypes, (state, action) => {
      quantityTypesAdapter.upsertMany(state.types, action.payload);
    })
);

export const selectors = quantityTypesAdapter.getSelectors(
  (state: RootState) => state.quantityType.types
);
