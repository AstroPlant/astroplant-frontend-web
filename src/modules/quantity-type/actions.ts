import { createAction } from "typesafe-actions";
import { QuantityType } from "astroplant-api";

export const addQuantityTypes = createAction(
  "quantityType/ADD_QUANTITY_TYPES",
  action => (payload: QuantityType[]) => action(payload)
);
