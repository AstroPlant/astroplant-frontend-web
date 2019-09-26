import * as types from "./actionTypes";

export function setRememberMe(payload: boolean): types.AuthActionTypes {
  return {
    type: types.AUTH_REMEMBER_ME_SET,
    payload
  };
}

export function setJwt(payload: string): types.AuthActionTypes {
  return {
    type: types.AUTH_JWT_SET,
    payload
  };
}

export function clearJwt(): types.AuthActionTypes {
  return {
    type: types.AUTH_JWT_CLEAR
  };
}

export function signUpRequest(
  username: string,
  password: string,
  emailAddress: string
): types.AuthActionTypes {
  return {
    type: types.AUTH_SIGN_UP_REQUEST,
    payload: { username, password, emailAddress }
  };
}

export function signUpSuccessAction(): types.AuthActionTypes {
  return {
    type: types.AUTH_SIGN_UP_SUCCESS
  };
}

export function signUpErrorAction(): types.AuthActionTypes {
  return {
    type: types.AUTH_SIGN_UP_ERROR
  };
}
