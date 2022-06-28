import { createAction } from "@reduxjs/toolkit";
import { PeripheralDefinition } from "astroplant-api";

interface WithKitSerial {
  serial: string;
}

export const addDefinitions = createAction<PeripheralDefinition[]>(
  "peripheralDefinition/ADD_DEFINITIONS"
);
