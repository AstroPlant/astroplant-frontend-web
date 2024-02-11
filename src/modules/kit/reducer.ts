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
  rawMeasurements: { [key: string]: RawMeasurement };
}

const kitsAdapter = createEntityAdapter<KitState, string>({
  selectId: (kit) => kit.serial,
});

const initialKit = (serial: string): KitState => ({
  serial,
  rawMeasurements: {},
});

const kitsSlice = createSlice({
  name: "kits",
  initialState: kitsAdapter.getInitialState(),
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(actions.rawMeasurementReceived, (state, action) => {
      const { peripheral, quantityType } = action.payload.rawMeasurement;
      kitsAdapter.addOne(state, initialKit(action.payload.serial));
      const kitState = state.entities[action.payload.serial]!;
      kitState.rawMeasurements[peripheral + "." + quantityType] =
        action.payload.rawMeasurement;
    }),
});

export default combineReducers({
  kits: kitsSlice.reducer,
});

export const kitSelectors = kitsAdapter.getSelectors(
  (state: RootState) => state.kit.kits,
);
