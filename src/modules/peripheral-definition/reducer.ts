import { createReducer, createEntityAdapter } from "@reduxjs/toolkit";
import * as actions from "./actions";
import { RootState } from "types";

import { PeripheralDefinition } from "astroplant-api";

export const definitionsAdapter = createEntityAdapter<PeripheralDefinition>({
  selectId: (peripheralDefinition) => peripheralDefinition.id,
});

export default createReducer(
  { definitions: definitionsAdapter.getInitialState() },
  (build) =>
    build.addCase(actions.addDefinitions, (state, action) => {
      definitionsAdapter.upsertMany(state.definitions, action.payload);
    })
);

export const selectors = definitionsAdapter.getSelectors(
  (state: RootState) => state.peripheralDefinition.definitions
);
