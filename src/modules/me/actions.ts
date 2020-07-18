import { createAction } from "@reduxjs/toolkit";
import { FullUser, KitMembership } from "astroplant-api";

export const setDetails = createAction<FullUser>("me/SET_DETAILS");

export const loadingKitMemberships = createAction("me/LOADING_KIT_MEMBERSHIPS");

export const setKitMemberships = createAction<KitMembership[]>(
  "me/SET_KIT_MEMBERSHIPS"
);

export const kitCreated = createAction("me/KIT_CREATED");
