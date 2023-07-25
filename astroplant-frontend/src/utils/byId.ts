/**
 * From: https://github.com/Collaborne/redux-byid
 */
import { AnyAction } from "redux";

export interface State<T> {
  [key: string]: T;
}

export type ItemReducer<T> = (
  state: T | undefined,
  action: AnyAction,
  id: string,
) => T | undefined;
export type GetId<T> = (
  action: AnyAction,
  state: State<T>,
) => string | undefined;

export function byId<T>(getId: GetId<T>, itemReducer: ItemReducer<T>) {
  return function reducer(state: State<T> = {}, action: AnyAction) {
    const id = getId(action, state);
    if (id) {
      const { [id]: itemState, ...newState } = state;
      const newItemState = itemReducer(itemState, action, id);
      if (newItemState !== undefined) {
        newState[id] = newItemState;
      }
      return newState;
    }

    return state;
  };
}

/**
 * Compose multiple item reducers into a single item reducer.
 *
 * @param itemReducers the reducers to compose
 */
export function compose<T>(
  ...itemReducers: Array<ItemReducer<T>>
): ItemReducer<T> {
  return (state, action, id) =>
    itemReducers.reduce((agg, reducer) => reducer(agg, action, id), state);
}

/**
 * Turn an array of items into an object of items, where the keys are provided
 * by the keySelector function.
 */
export function arrayToObject<T>(array: T[], keySelector: (v: T) => string) {
  return array.reduce((obj: { [id: string]: T }, v: T) => {
    obj[keySelector(v)] = v;
    return obj;
  }, {});
}
