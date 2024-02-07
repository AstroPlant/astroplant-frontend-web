import {
  combineReducers,
  createEntityAdapter,
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

const kitsAdapter = createEntityAdapter<KitState, string>({
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
      .addCase(actions.rawMeasurementReceived, (state, action) => {
        const { peripheral, quantityType } = action.payload.rawMeasurement;
        const kitState = state.entities[action.payload.serial];
        if (kitState !== undefined) {
          kitState.rawMeasurements[peripheral + "." + quantityType] =
            action.payload.rawMeasurement;
        }
      }),
});

export default combineReducers({
  kits: kitsSlice.reducer,
});

export const kitSelectors = kitsAdapter.getSelectors(
  (state: RootState) => state.kit.kits,
);
