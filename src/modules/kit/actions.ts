import { createAction } from "typesafe-actions";
import { Kit } from "astroplant-api";

interface WithKitSerial {
  serial: string;
}

export const addKit = createAction(
  "kit/ADD",
  action => (payload: Kit) => action(payload)
);
