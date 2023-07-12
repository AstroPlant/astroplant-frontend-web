import { createReducer } from "@reduxjs/toolkit";
import isEqual from "lodash/isEqual";
import * as actions from "./actions";
import { byId, arrayToObject } from "~/utils/byId";

import { schemas } from "~/api";

export type KitConfigurationState = schemas["KitConfiguration"] & {
  peripherals: { [peripheralId: string]: schemas["Peripheral"] };
};

export interface Measurement {
  quantityType: number;
  value: number;
}

export interface RawMeasurement extends Measurement {
  kitSerial: string;
  peripheral: number;
  datetime: string;
}

export interface KitState {
  details: schemas["Kit"] | null;
  configurations: { [id: string]: KitConfigurationState } | null;
  loadingConfigurations: boolean;
  rawMeasurements: { [key: string]: RawMeasurement };
  status: "None" | "Fetching" | "NotFound" | "NotAuthorized" | "Fetched";
}

export interface KitsState {
  kits: {
    [serial: string]: KitState;
  };
}

const initial: KitsState = {
  kits: {},
};

const initialKit: KitState = {
  details: null,
  configurations: null,
  loadingConfigurations: false,
  rawMeasurements: {},
  status: "None",
};

const kitReducer = createReducer<KitState>(initialKit, (builder) =>
  builder
    .addCase(actions.fetchKit, (state, _action) => {
      state.status = "Fetching";
    })
    .addCase(actions.notFound, (state, _action) => {
      state.status = "NotFound";
    })
    .addCase(actions.notAuthorized, (state, _action) => {
      state.status = "NotAuthorized";
    })
    .addCase(actions.addKit, (state, action) => {
      state.details = action.payload;
      state.status = "Fetched";
    })
    .addCase(actions.kitConfigurationsRequest, (state, _action) => {
      state.loadingConfigurations = true;
    })
    .addCase(actions.kitConfigurationsSuccess, (state, action) => {
      if (state.configurations === null) {
        state.configurations = {};
      }

      const configurationIds = action.payload.configurations.map(
        (conf) => conf.id
      );

      for (const configurationId of Object.keys(state.configurations)) {
        if (!configurationIds.includes(Number(configurationId))) {
          delete state.configurations[configurationId];
        }
      }

      for (const { peripherals, ...confRest } of action.payload
        .configurations) {
        const conf = {
          ...confRest,
          peripherals: arrayToObject(peripherals, (peripheral) =>
            peripheral.id.toString()
          ),
        };

        if (
          !(conf.id in state.configurations) ||
          !isEqual(conf, state.configurations[conf.id])
        ) {
          state.configurations[conf.id] = conf;
        }
      }
      state.loadingConfigurations = false;
    })
    .addCase(actions.kitSetAllConfigurationsInactive, (state, action) => {
      if (state.configurations === null) {
        return;
      } else {
        for (const configuration of Object.values(state.configurations)) {
          configuration.active = false;
        }
      }
    })
    .addCase(actions.rawMeasurementReceived, (state, action) => {
      const { peripheral, quantityType } = action.payload.rawMeasurement;
      state.rawMeasurements[peripheral + "." + quantityType] =
        action.payload.rawMeasurement;
    })
);

const kitReducerWrapper = (state: KitState, action: any) => {
  const state2 = kitReducer(state, action) as any;

  let newConfigurations = kitConfigurationReducerById(
    state2.configurations || {},
    action
  );

  if (
    state2.configurations === null &&
    Object.keys(newConfigurations).length === 0
  ) {
    return { ...state2, configurations: null };
  } else {
    return { ...state2, configurations: newConfigurations };
  }
};

const kitConfigurationReducer = createReducer<KitConfigurationState>(
  {} as KitConfigurationState,
  (builder) =>
    builder
      .addCase(actions.kitConfigurationCreated, (state, action) => {
        const { configuration } = action.payload;
        const configurationWithPeripherals: KitConfigurationState = {
          ...configuration,
          peripherals: {},
        };

        return configurationWithPeripherals;
      })
      .addCase(actions.kitConfigurationUpdated, (state, action) => {
        const { configuration } = action.payload;
        // const existingConfigurationPeripherals = state.peripherals || [];

        const newConfiguration = {
          ...configuration,
          peripherals: state.peripherals,
          // peripherals: existingConfigurationPeripherals,
        };

        return newConfiguration;
      })
);

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

const peripheralReducer = createReducer<schemas["Peripheral"]>(
  {} as schemas["Peripheral"],
  (builder) =>
    builder
      .addCase(actions.peripheralCreated, (state, action) => {
        return action.payload.peripheral;
      })
      .addCase(actions.peripheralUpdated, (state, action) => {
        return action.payload.peripheral;
      })
      .addCase(actions.peripheralDeleted, (state, _action) => {
        return undefined as any;
      })
);

const kitReducerById = byId(
  (action: any) => (action.payload || {}).serial,
  kitReducerWrapper as any
);

const kitConfigurationReducerById = byId((action: any) => {
  const maybeWithConfiguration = action.payload || {};
  return (
    maybeWithConfiguration.configuration?.id ??
    maybeWithConfiguration.configurationId ??
    maybeWithConfiguration.peripheral?.kitConfigurationId
  );
}, kitConfigurationReducerWrapper as any);

const peripheralReducerById = byId((action: any) => {
  const maybeWithPeripheral = action.payload || {};
  return maybeWithPeripheral.peripheral?.id ?? maybeWithPeripheral.peripheralId;
}, peripheralReducer as any);

export default function rootKitReducer(state = initial, action: any) {
  const { kits, ...otherState } = state;

  const newKits = kitReducerById(kits, action) as any;

  return { ...otherState, kits: newKits };
}
