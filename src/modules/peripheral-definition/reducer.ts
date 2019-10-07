import { createReducer, ActionType } from "typesafe-actions";
import * as actions from "./actions";

import { PeripheralDefinition } from "astroplant-api";

export interface PeripheralDefinitionState {
  definitions: { [id: string]: PeripheralDefinition };
}

const initial: PeripheralDefinitionState = {
  definitions: {}
};

export type PeripheralDefinitionAction = ActionType<typeof actions>;

export default createReducer<
  PeripheralDefinitionState,
  PeripheralDefinitionAction
>(initial).handleAction(actions.addDefinitions, (state, action) => {
  const { definitions, ...rest } = state;

  let newDefinitions: {[id: string]: PeripheralDefinition} = {};
  for (const def of action.payload) {
    newDefinitions[def.id.toString()] = def;
  }

  return { definitions: { ...newDefinitions, ...definitions }, ...rest };
});
