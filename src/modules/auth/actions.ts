import { createAction } from "@reduxjs/toolkit";

export const notAuthenticated = createAction("auth/NOT_AUTHENTICATED");

export const setRememberMe = createAction(
  "auth/SET_REMEMBER_ME",
  (rememberMe: boolean) => ({ payload: rememberMe }),
);

export const setRefreshToken = createAction(
  "auth/SET_REFRESH_TOKEN",
  (token: string) => ({ payload: { token } }),
);

export const clearRefreshToken = createAction("auth/CLEAR_REFRESH_TOKEN");

export const setAccessToken = createAction(
  "auth/SET_ACCESS_TOKEN",
  (token: string) => ({ payload: token }),
);

export const clearAccessToken = createAction("auth/CLEAR_ACCESS_TOKEN");

export const clearTokens = createAction("auth/CLEAR_TOKENS");
