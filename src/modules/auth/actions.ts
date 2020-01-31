import { createAction } from "typesafe-actions";

export const notAuthenticated = createAction("auth/NOT_AUTHENTICATED");

export const setRememberMe = createAction(
  "auth/SET_REMEMBER_ME",
  action => (rememberMe: boolean) => action(rememberMe)
);

export const setRefreshToken = createAction(
  "auth/SET_REFRESH_TOKEN",
  action => (token: string) => action({ token })
);

export const clearRefreshToken = createAction(
  "auth/CLEAR_REFRESH_TOKEN",
  action => () => action()
);

export const setAccessToken = createAction(
  "auth/SET_ACCESS_TOKEN",
  action => (token: string) => action(token)
);

export const clearAccessToken = createAction(
  "auth/CLEAR_ACCESS_TOKEN",
  action => () => action()
);

export const clearTokens = createAction("auth/CLEAR_TOKENS", action => () =>
  action()
);
