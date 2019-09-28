import * as types from "./actionTypes";

export function setRememberMe(payload: boolean): types.AuthActionTypes {
  return {
    type: types.AUTH_REMEMBER_ME_SET,
    payload
  };
}

export function setRefreshToken(payload: string): types.AuthActionTypes {
  return {
    type: types.AUTH_REFRESH_TOKEN_SET,
    payload
  };
}

export function clearRefreshToken(): types.AuthActionTypes {
  return {
    type: types.AUTH_REFRESH_TOKEN_CLEAR
  };
}

export function setAuthenticationToken(payload: string): types.AuthActionTypes {
  return {
    type: types.AUTH_AUTHENTICATION_TOKEN_SET,
    payload
  };
}

export function clearAuthenticationToken(): types.AuthActionTypes {
  return {
    type: types.AUTH_AUTHENTICATION_TOKEN_CLEAR
  };
}
