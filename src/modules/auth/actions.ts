import { createAction } from "typesafe-actions";

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

export const setAuthenticationToken = createAction(
  "auth/SET_AUTHENTICATION_TOKEN",
  action => (token: string) => action(token)
);

export const clearAuthenticationToken = createAction(
  "auth/CLEAR_AUTHENTICATION_TOKEN",
  action => () => action()
);
