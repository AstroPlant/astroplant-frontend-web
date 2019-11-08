import { createReducer, ActionType } from "typesafe-actions";
import * as actions from "./actions";

export interface AuthState {
  rememberMe: boolean;
  refreshToken: string | null;
  accessToken: string | null;
}

const initial: AuthState = {
  rememberMe: false,
  refreshToken: null,
  accessToken: null
};

export type AuthAction = ActionType<typeof actions>;

export default createReducer<AuthState, AuthAction>(initial)
  .handleAction(actions.setRememberMe, (state, action) => {
    return { ...state, rememberMe: action.payload };
  })
  .handleAction(actions.setRefreshToken, (state, action) => {
    return { ...state, refreshToken: action.payload.token };
  })
  .handleAction(actions.clearRefreshToken, (state, _) => {
    return { ...state, refreshToken: null };
  })
  .handleAction(actions.setAccessToken, (state, action) => {
    return { ...state, accessToken: action.payload };
  })
  .handleAction(actions.clearAccessToken, (state, _) => {
    return { ...state, accessToken: null };
  })
  .handleAction(actions.clearTokens, (state, _) => {
    return { ...state, refreshToken: null, authenticationToken: null };
  });
