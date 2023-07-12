import { createReducer, createEntityAdapter } from "@reduxjs/toolkit";
import * as actions from "./actions";
import { RootState } from "~/types";
import { schemas } from "~/api";

export const quantityTypesAdapter = createEntityAdapter<schemas["QuantityType"]>({
  selectId: (quantityType) => quantityType.id,
});

export default createReducer(quantityTypesAdapter.getInitialState(), (build) =>
  build.addCase(actions.addQuantityTypes, (state, action) => {
    quantityTypesAdapter.upsertMany(state, action.payload);
  })
);

export const selectors = quantityTypesAdapter.getSelectors(
  (state: RootState) => state.quantityType
);
