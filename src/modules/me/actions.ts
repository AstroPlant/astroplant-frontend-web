import { createAction } from "@reduxjs/toolkit";
import { schemas } from "~/api";

export const setUsername = createAction<string>("me/SET_USERNAME");

export const loadingKitMemberships = createAction("me/LOADING_KIT_MEMBERSHIPS");

export const setKitMemberships = createAction<schemas["KitMembership"][]>(
  "me/SET_KIT_MEMBERSHIPS",
);

export const kitCreated = createAction("me/KIT_CREATED");
