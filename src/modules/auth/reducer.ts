import { createReducer, getType, ActionType } from "typesafe-actions";
import * as actions from "./actions";

export interface AuthState {
  rememberMe: boolean;
  refreshToken: string | null;
  authenticationToken: string | null;
}

const initial: AuthState = {
  rememberMe: false,
  refreshToken: null,
  authenticationToken: null
};

export type AuthAction = ActionType<typeof actions>;

export default createReducer<AuthState, AuthAction>(initial)
  .handleAction(actions.setRefreshToken, (state, action) => {
    return { ...state, refreshToken: action.payload.token };
  })
  .handleAction(actions.clearRefreshToken, (state, action) => {
    return { ...state, refreshToken: null };
  })
  .handleAction(actions.setAuthenticationToken, (state, action) => {
    return { ...state, authenticationToken: action.payload };
  })
  .handleAction(actions.clearAuthenticationToken, (state, action) => {
    return { ...state, authenticationToken: null };
  });
