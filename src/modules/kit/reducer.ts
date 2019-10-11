import { createReducer, ActionType } from "typesafe-actions";
import * as actions from "./actions";
import Option from "utils/option";
import { byId } from "utils/byId";

import { Kit } from "astroplant-api";
import { KitConfigurationWithPeripherals } from "astroplant-api";

export interface Measurement {
  physicalQuantity: string;
  physicalUnit: string;
  value: number;
}

export interface KitState {
  details: Kit;
  configurations: { [id: string]: KitConfigurationWithPeripherals };
  loadingConfigurations: boolean;
  realTime: { [key: string]: Measurement };
}

export interface KitsState {
  kits: {
    [serial: string]: KitState;
  };
}

const initial: KitsState = {
  kits: {}
};

const initialKit: KitState = {
  details: {} as any,
  configurations: {},
  loadingConfigurations: false,
  realTime: {}
};

export type KitAction = ActionType<typeof actions>;

const kitReducer = createReducer<KitState, KitAction>(initialKit)
  .handleAction(actions.addKit, (state, action) => {
    return { ...state, details: action.payload };
  })
  .handleAction(actions.kitConfigurationsRequest, (state, action) => {
    return { ...state, loadingConfigurations: true };
  })
  .handleAction(actions.kitConfigurationsSuccess, (state, action) => {
    let configurations: { [id: string]: KitConfigurationWithPeripherals } = {};
    for (const conf of action.payload.configurations) {
      configurations[conf.id] = conf;
    }
    return {
      ...state,
      configurations,
      loadingConfigurations: false
    };
  })
  .handleAction(actions.kitConfigurationCreated, (state, action) => {
    const { configuration } = action.payload;
    let { configurations } = state;
    configurations[configuration.id] = configuration;

    return {
      ...state,
      configurations
    };
  });

const kitReducerById = byId(
  (action: any) => (action.payload || {}).serial,
  kitReducer as any
);

export default function(state = initial, action: any) {
  const { kits, ...otherState } = state;

  const newKits = kitReducerById(kits, action) as any;

  return { kits: newKits, ...otherState };
}
