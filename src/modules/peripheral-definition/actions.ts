import { createAction } from "typesafe-actions";
import { PeripheralDefinition } from "astroplant-api";

interface WithKitSerial {
  serial: string;
}

export const addDefinitions = createAction(
  "peripheralDefinition/ADD_DEFINITIONS",
  action => (payload: PeripheralDefinition[]) => action(payload)
);
