export const AUTH_REMEMBER_ME_SET = "AUTH_REMEMBER_ME_SET";
export const AUTH_JWT_SET = "AUTH_JWT_SET";
export const AUTH_JWT_CLEAR = "AUTH_JWT_CLEAR";
export const AUTH_SIGN_UP_REQUEST = "AUTH_SIGN_UP_REQUEST";
export const AUTH_SIGN_UP_SUCCESS = "AUTH_SIGN_UP_SUCCESS";
export const AUTH_SIGN_UP_ERROR = "AUTH_SIGN_UP_ERROR";

export interface RememberMeSetAction {
  type: typeof AUTH_REMEMBER_ME_SET;
  payload: boolean;
}

export interface JwtSetAction {
  type: typeof AUTH_JWT_SET;
  payload: string;
}

export interface JwtClearAction {
  type: typeof AUTH_JWT_CLEAR;
}

export interface SignUpRequestAction {
  type: typeof AUTH_SIGN_UP_REQUEST;
  payload: {
    username: string;
    password: string;
    emailAddress: string;
  };
}

export interface SignUpSuccessAction {
  type: typeof AUTH_SIGN_UP_SUCCESS;
}

export interface SignUpErrorAction {
  type: typeof AUTH_SIGN_UP_ERROR;
}

export type AuthActionTypes =
  | RememberMeSetAction
  | JwtSetAction
  | JwtClearAction
  | SignUpRequestAction
  | SignUpSuccessAction
  | SignUpErrorAction;
