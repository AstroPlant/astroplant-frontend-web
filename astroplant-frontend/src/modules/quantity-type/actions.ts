import { createAction } from "@reduxjs/toolkit";
import { QuantityType } from "astroplant-api";

export const addQuantityTypes = createAction<QuantityType[]>(
  "quantityType/ADD_QUANTITY_TYPES"
);
