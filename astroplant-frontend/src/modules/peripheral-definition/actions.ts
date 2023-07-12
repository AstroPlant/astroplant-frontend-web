import { createAction } from "@reduxjs/toolkit";
import { schemas } from "~/api";

export const addDefinitions = createAction<schemas["PeripheralDefinition"][]>(
  "peripheralDefinition/ADD_DEFINITIONS"
);
