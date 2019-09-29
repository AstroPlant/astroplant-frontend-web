import { createAction } from "typesafe-actions";
import { FullUser } from "../../api/api";

export const setDetails = createAction(
  "me/SET_DETAILS",
  action => (payload: FullUser) => action(payload)
);
