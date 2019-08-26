import { ONE_ACTION } from "./constants";

export const oneAction = data => {
  return {
    type: ONE_ACTION,
    payload: data
  };
};
