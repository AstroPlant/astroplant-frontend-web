import { createAction } from "typesafe-actions";
import { Kit, KitConfigurationWithPeripherals, KitConfiguration } from "astroplant-api";

interface WithKitSerial {
  serial: string;
}

export const addKit = createAction("kit/ADD", action => (payload: Kit) =>
  action(payload)
);

export const startWatching = createAction(
  "kit/START_WATCHING",
  action => (payload: { serial: string }) => action(payload)
);

export const stopWatching = createAction(
  "kit/STOP_WATCHING",
  action => (payload: { serial: string }) => action(payload)
);

export const kitConfigurationsRequest = createAction(
  "kit/KIT_CONFIGURATIONS_REQUEST",
  action => (payload: { serial: string }) => action(payload)
);

export const kitConfigurationsSuccess = createAction(
  "kit/KIT_CONFIGURATIONS_SUCCESS",
  action => (payload: {
    serial: string;
    configurations: KitConfigurationWithPeripherals[];
  }) => action(payload)
);

export const kitConfigurationCreated = createAction(
  "kit/KIT_CONFIGURATION_CREATED",
  action => (payload: {
    serial: string;
    configuration: KitConfiguration;
  }) => action(payload)
);
