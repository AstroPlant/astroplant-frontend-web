export const AUTH_REMEMBER_ME_SET = "AUTH_REMEMBER_ME_SET";
export const AUTH_REFRESH_TOKEN_SET = "AUTH_REFRESH_TOKEN_SET";
export const AUTH_REFRESH_TOKEN_CLEAR = "AUTH_REFRESH_TOKEN_CLEAR";
export const AUTH_AUTHENTICATION_TOKEN_SET = "AUTH_AUTHENTICATION_TOKEN_SET";
export const AUTH_AUTHENTICATION_TOKEN_CLEAR =
  "AUTH_AUTHENTICATION_TOKEN_CLEAR";
export const AUTH_SIGN_UP_REQUEST = "AUTH_SIGN_UP_REQUEST";
export const AUTH_SIGN_UP_SUCCESS = "AUTH_SIGN_UP_SUCCESS";
export const AUTH_SIGN_UP_ERROR = "AUTH_SIGN_UP_ERROR";

export interface RememberMeSetAction {
  type: typeof AUTH_REMEMBER_ME_SET;
  payload: boolean;
}

export interface RefreshTokenSetAction {
  type: typeof AUTH_REFRESH_TOKEN_SET;
  payload: string;
}

export interface RefreshTokenClearAction {
  type: typeof AUTH_REFRESH_TOKEN_CLEAR;
}

export interface AuthenticationTokenSetAction {
  type: typeof AUTH_AUTHENTICATION_TOKEN_SET;
  payload: string;
}

export interface AuthenticationTokenClearAction {
  type: typeof AUTH_AUTHENTICATION_TOKEN_CLEAR;
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
  | RefreshTokenSetAction
  | RefreshTokenClearAction
  | AuthenticationTokenSetAction
  | AuthenticationTokenClearAction
  | SignUpRequestAction
  | SignUpSuccessAction
  | SignUpErrorAction;
