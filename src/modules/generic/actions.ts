import * as types from './actionTypes';

export function pageInitializationSuccess(): types.GenericActionTypes  {
  return {
    type: types.PAGE_INITIALIZATION_SUCCESS,
  };
}

export function pageLoadSuccess(): types.GenericActionTypes  {
  return {
    type: types.PAGE_LOAD_SUCCESS,
  };
}
