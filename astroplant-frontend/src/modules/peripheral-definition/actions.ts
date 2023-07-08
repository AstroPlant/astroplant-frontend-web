import { createAction } from "@reduxjs/toolkit";
import { PeripheralDefinition } from "astroplant-api";

export const addDefinitions = createAction<PeripheralDefinition[]>(
  "peripheralDefinition/ADD_DEFINITIONS"
);
