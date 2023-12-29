import {
  combineReducers,
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import * as actions from "./actions";

import { schemas } from "~/api";
import { RootState } from "~/store";

export type KitConfigurationState = schemas["KitConfiguration"] & {
  peripherals: number[];
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
  serial: string;
  details: schemas["Kit"] | null;
  configurations: number[];
  loadingConfigurations: boolean;
  rawMeasurements: { [key: string]: RawMeasurement };
  status: "None" | "Fetching" | "NotFound" | "NotAuthorized" | "Fetched";
}

const kitsAdapter = createEntityAdapter<KitState>({
  selectId: (kit) => kit.serial,
});

const initialKit = (serial: string): KitState => ({
  serial,
  details: null,
  configurations: [],
  loadingConfigurations: false,
  rawMeasurements: {},
  status: "None",
});

const kitsSlice = createSlice({
  name: "kits",
  initialState: kitsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(actions.fetchKit, (state, action) => {
        // Add default if not exists
        kitsAdapter.addOne(state, initialKit(action.payload.serial));

        kitsAdapter.updateOne(state, {
          id: action.payload.serial,
          changes: {
            status: "Fetching",
          },
        });
      })
      .addCase(actions.notFound, (state, action) => {
        // Add default if not exists
        kitsAdapter.addOne(state, initialKit(action.payload.serial));

        kitsAdapter.updateOne(state, {
          id: action.payload.serial,
          changes: {
            status: "NotFound",
          },
        });
      })
      .addCase(actions.notAuthorized, (state, action) => {
        // Add default if not exists
        kitsAdapter.addOne(state, initialKit(action.payload.serial));

        kitsAdapter.updateOne(state, {
          id: action.payload.serial,
          changes: {
            status: "NotAuthorized",
          },
        });
      })
      .addCase(actions.addKit, (state, action) => {
        // Add default if not exists
        kitsAdapter.addOne(state, initialKit(action.payload.serial));

        kitsAdapter.updateOne(state, {
          id: action.payload.serial,
          changes: {
            details: action.payload,
          },
        });
      })
      .addCase(actions.deleteKit, (state, action) => {
        kitsAdapter.removeOne(state, action.payload.serial);
      })
      .addCase(actions.kitConfigurationCreated, (state, action) => {
        const kit = state.entities[action.payload.serial];
        if (kit !== undefined) {
          kit.configurations.push(action.payload.configuration.id);
        }
      })
      .addCase(actions.kitConfigurationDeleted, (state, action) => {
        const kit = state.entities[action.payload.serial];
        if (kit !== undefined) {
          const idx = kit.configurations.indexOf(
            action.payload.kitConfigurationId,
          );
          if (idx !== -1) {
            kit.configurations.splice(idx, 1);
          }
        }
      })
      .addCase(actions.kitConfigurationsRequest, (state, action) => {
        kitsAdapter.updateOne(state, {
          id: action.payload.serial,
          changes: {
            loadingConfigurations: true,
          },
        });
      })
      .addCase(actions.kitConfigurationsSuccess, (state, action) => {
        // Add default if not exists
        kitsAdapter.addOne(state, initialKit(action.payload.serial));

        kitsAdapter.updateOne(state, {
          id: action.payload.serial,
          changes: {
            configurations: Object.values(action.payload.configurations).map(
              (conf) => conf.id,
            ),
          },
        });
      })
      .addCase(actions.rawMeasurementReceived, (state, action) => {
        const { peripheral, quantityType } = action.payload.rawMeasurement;
        const kitState = state.entities[action.payload.serial];
        if (kitState !== undefined) {
          kitState.rawMeasurements[peripheral + "." + quantityType] =
            action.payload.rawMeasurement;
        }
      }),
});

const configurationsAdapter = createEntityAdapter<KitConfigurationState>({
  selectId: (configuration) => configuration.id,
});

const configurationsSlice = createSlice({
  name: "configurations",
  initialState: configurationsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(actions.kitConfigurationsSuccess, (state, action) => {
        configurationsAdapter.setMany(
          state,
          action.payload.configurations.map((conf) => ({
            ...conf,
            peripherals: conf.peripherals.map((peripheral) => peripheral.id),
          })),
        );
      })
      .addCase(actions.kitConfigurationCreated, (state, action) => {
        configurationsAdapter.setOne(state, {
          ...action.payload.configuration,
          peripherals: [],
        });
      })
      .addCase(actions.kitConfigurationUpdated, (state, action) => {
        configurationsAdapter.updateOne(state, {
          id: action.payload.configuration.id,
          changes: action.payload.configuration,
        });
      })
      .addCase(actions.kitConfigurationDeleted, (state, action) => {
        configurationsAdapter.removeOne(
          state,
          action.payload.kitConfigurationId,
        );
      })
      .addCase(actions.kitSetAllConfigurationsInactive, (state, action) => {
        // O-linear time in the number of loaded configurations regardless of
        // the number of kits. Not very efficient if many kits are loaded.
        Object.values(state.entities)
          .filter((conf) => conf?.kitId === action.payload.kitId)
          .forEach((conf) => (conf!.active = false));
      })
      .addCase(actions.peripheralCreated, (state, action) => {
        const configuration =
          state.entities[action.payload.peripheral.kitConfigurationId];
        if (configuration !== undefined) {
          configuration.peripherals.push(action.payload.peripheral.id);
        }
      })
      .addCase(actions.peripheralDeleted, (state, action) => {
        const configuration = state.entities[action.payload.kitConfigurationId];
        if (configuration !== undefined) {
          configuration.peripherals = configuration.peripherals.filter(
            (id) => id !== action.payload.peripheralId,
          );
        }
      })
      .addCase(actions.deleteKit, (state, action) => {
        const ids = Object.values(state.entities)
          .filter(
            (configuration) => configuration?.kitId === action.payload.kitId,
          )
          .map((configuration) => configuration!.id);

        configurationsAdapter.removeMany(state, ids);
      }),
});

const peripheralsAdapter = createEntityAdapter<schemas["Peripheral"]>({
  selectId: (peripheral) => peripheral.id,
});

const peripheralsSlice = createSlice({
  name: "peripherals",
  initialState: peripheralsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(actions.kitConfigurationsSuccess, (state, action) => {
        peripheralsAdapter.setMany(
          state,
          action.payload.configurations.flatMap((conf) => conf.peripherals),
        );
      })
      .addCase(actions.peripheralCreated, (state, action) => {
        peripheralsAdapter.addOne(state, action.payload.peripheral);
      })
      .addCase(actions.peripheralUpdated, (state, action) => {
        peripheralsAdapter.setOne(state, action.payload.peripheral);
      })
      .addCase(actions.peripheralDeleted, (state, action) => {
        peripheralsAdapter.removeOne(state, action.payload.peripheralId);
      })
      .addCase(actions.kitConfigurationDeleted, (state, action) => {
        // Find peripherals belonging to the given configuration
        const ids = Object.values(state.entities)
          .filter(
            (peripheral) =>
              peripheral?.kitConfigurationId ===
              action.payload.kitConfigurationId,
          )
          .map((peripheral) => peripheral!.id);

        peripheralsAdapter.removeMany(state, ids);
      })
      .addCase(actions.deleteKit, (state, action) => {
        const ids = Object.values(state.entities)
          .filter((peripheral) => peripheral?.kitId === action.payload.kitId)
          .map((peripheral) => peripheral!.id);

        peripheralsAdapter.removeMany(state, ids);
      }),
});

export default combineReducers({
  kits: kitsSlice.reducer,
  configurations: configurationsSlice.reducer,
  peripherals: peripheralsSlice.reducer,
});

export const kitSelectors = kitsAdapter.getSelectors(
  (state: RootState) => state.kit.kits,
);
export const configurationSelectors = configurationsAdapter.getSelectors(
  (state: RootState) => state.kit.configurations,
);
export const peripheralSelectors = peripheralsAdapter.getSelectors(
  (state: RootState) => state.kit.peripherals,
);

export const configurationsById = createSelector(
  [configurationSelectors.selectEntities, (_state, ids: number[]) => ids],
  (configurations, ids) => ids.map((id) => configurations[id]),
);

/**
 * Fetch all configurations of a kit by kit serial.
 */
export const allConfigurationsOfKit: (
  state: RootState,
  serial: string,
) => { [id: string]: KitConfigurationState } | null = createSelector(
  [kitSelectors.selectById, configurationSelectors.selectEntities],
  (kit, configurations) => {
    if (kit === undefined) {
      return null;
    }

    const kitConfigurations = kit.configurations.map(
      (configurationId) => configurations[configurationId],
    );

    // Invariant
    if (
      kitConfigurations.some((configuration) => configuration === undefined)
    ) {
      throw new Error("expected all kit configurations to be loaded");
    }

    return (kitConfigurations as KitConfigurationState[]).reduce<{
      [id: string]: KitConfigurationState;
    }>((acc, val) => {
      acc[val.id.toString()] = val;
      return acc;
    }, {});
  },
);
