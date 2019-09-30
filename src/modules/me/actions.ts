import { createAction } from "typesafe-actions";
import { FullUser, KitMembership } from "../../api/api";

export const setDetails = createAction(
  "me/SET_DETAILS",
  action => (payload: FullUser) => action(payload)
);

export const setKitMemberships = createAction(
  "me/SET_KIT_MEMBERSHIPS",
  action => (payload: KitMembership[]) => action(payload)
);

export const kitCreated = createAction("me/KIT_CREATED");
