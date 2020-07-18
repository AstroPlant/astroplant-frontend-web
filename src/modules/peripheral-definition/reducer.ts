import { createReducer } from "@reduxjs/toolkit";
import * as actions from "./actions";

import { PeripheralDefinition } from "astroplant-api";

export interface PeripheralDefinitionState {
  definitions: { [id: string]: PeripheralDefinition };
}

const initial: PeripheralDefinitionState = {
  definitions: {},
};

export default createReducer<PeripheralDefinitionState>(initial, (build) =>
  build.addCase(actions.addDefinitions, (state, action) => {
    for (const def of action.payload) {
      state.definitions[def.id.toString()] = def;
    }
  })
);
