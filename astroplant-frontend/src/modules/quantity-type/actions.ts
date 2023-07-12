import { createAction } from "@reduxjs/toolkit";
import { schemas } from "~/api";

export const addQuantityTypes = createAction<schemas["QuantityType"][]>(
  "quantityType/ADD_QUANTITY_TYPES"
);
