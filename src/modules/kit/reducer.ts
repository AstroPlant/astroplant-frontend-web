import { createReducer, ActionType } from "typesafe-actions";
import * as actions from "./actions";
import Option from "utils/option";
import { byId, arrayToObject } from "utils/byId";

import { Kit } from "astroplant-api";
import { KitConfiguration, Peripheral } from "astroplant-api";

export type KitConfigurationState = KitConfiguration & {
  peripherals: { [peripheralId: string]: Peripheral };
};


export interface Measurement {
  physicalQuantity: string;
  physicalUnit: string;
  value: number;
}

export interface RawMeasurement extends Measurement {
  kitSerial: string;
  peripheral: number;
  datetime: number;
}

export interface KitState {
  details: Kit;
  configurations: { [id: string]: KitConfigurationState };
  loadingConfigurations: boolean;
  rawMeasurements: { [key: string]: RawMeasurement };
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
  rawMeasurements: {}
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
    let configurations: { [id: string]: KitConfigurationState } = {};
    for (const { peripherals, ...confRest } of action.payload.configurations) {
      const conf = {
        ...confRest,
        peripherals: arrayToObject(peripherals, peripheral =>
          peripheral.id.toString()
        )
      };
      configurations[conf.id] = conf;
    }
    return {
      ...state,
      configurations,
      loadingConfigurations: false
    };
  })
  .handleAction(actions.kitSetAllConfigurationsInactive, (state, action) => {
    let configurations: { [id: string]: KitConfigurationState } = {};
    for (const id of Object.keys(state.configurations)) {
      const conf = state.configurations[id];
      configurations[id] = { ...conf, active: false };
    }

    return { ...state, configurations };
  })
  .handleAction(actions.rawMeasurementReceived, (state, action) => {
    let rawMeasurements = state.rawMeasurements;
    rawMeasurements[action.payload.rawMeasurement.peripheral] = action.payload.rawMeasurement;

    return { ...state, rawMeasurements };
  });

const kitReducerWrapper = (state: KitState, action: any) => {
  const state2 = kitReducer(state, action) as any;
  const newConfigurations = kitConfigurationReducerById(
    state2.configurations,
    action
  ) as any;
  return { ...state2, configurations: newConfigurations };
};

const kitConfigurationReducer = createReducer<KitConfigurationState, KitAction>(
  {} as KitConfigurationState
)
  .handleAction(actions.kitConfigurationCreated, (state, action) => {
    const { configuration } = action.payload;
    const configurationWithPeripherals: KitConfigurationState = {
      ...configuration,
      peripherals: {}
    };

    return configurationWithPeripherals;
  })
  .handleAction(actions.kitConfigurationUpdated, (state, action) => {
    const { configuration } = action.payload;
    const existingConfigurationPeripherals = state.peripherals || [];

    const newConfiguration = {
      ...configuration,
      peripherals: existingConfigurationPeripherals
    };

    return newConfiguration;
  });

const kitConfigurationReducerWrapper = (
  state: KitConfigurationState,
  action: any
) => {
  const state2 = kitConfigurationReducer(state, action) as any;
  const newPeripherals = peripheralReducerById(
    state2.peripherals,
    action
  ) as any;
  return { ...state2, peripherals: newPeripherals };
};

const peripheralReducer = createReducer<Peripheral, KitAction>({} as Peripheral)
  .handleAction(actions.peripheralCreated, (state, action) => {
    return action.payload.peripheral;
  })
  .handleAction(actions.peripheralUpdated, (state, action) => {
    return action.payload.peripheral;
  })
  .handleAction(actions.peripheralDeleted, (state, action) => {
    return undefined as any;
  });

const kitReducerById = byId(
  (action: any) => (action.payload || {}).serial,
  kitReducerWrapper as any
);

const kitConfigurationReducerById = byId(
  (action: any) => {
    const maybeWithConfiguration = action.payload || {};
    return (
      (maybeWithConfiguration.configuration || {}).id ||
      maybeWithConfiguration.configurationId
    );
  },
  kitConfigurationReducerWrapper as any
);

const peripheralReducerById = byId(
  (action: any) => {
    const maybeWithPeripheral = action.payload || {};
    return (
      (maybeWithPeripheral.peripheral || {}).id ||
      maybeWithPeripheral.peripheralId
    );
  },
  peripheralReducer as any
);

export default function(state = initial, action: any) {
  const { kits, ...otherState } = state;

  const newKits = kitReducerById(kits, action) as any;

  return { ...otherState, kits: newKits };
}
