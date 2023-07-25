import { createReducer, createEntityAdapter } from "@reduxjs/toolkit";
import * as actions from "./actions";
import { RootState } from "~/types";
import { schemas } from "~/api";

export const definitionsAdapter = createEntityAdapter<
  schemas["PeripheralDefinition"]
>({
  selectId: (peripheralDefinition) => peripheralDefinition.id,
});

export default createReducer(definitionsAdapter.getInitialState(), (build) =>
  build.addCase(actions.addDefinitions, (state, action) => {
    definitionsAdapter.upsertMany(state, action.payload);
  }),
);

export const selectors = definitionsAdapter.getSelectors(
  (state: RootState) => state.peripheralDefinition,
);
