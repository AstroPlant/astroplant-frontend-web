import { persistReducer } from "redux-persist";
import localStorage from "redux-persist/lib/storage";
import { createReducer, ActionType } from "typesafe-actions";
import * as actions from "./actions";

export interface AuthState {
  authenticationRan: boolean;
  rememberMe: boolean;
  refreshToken: string | null;
  accessToken: string | null;
}

const persistConfig = {
  key: "auth",
  whitelist: ["rememberMe", "refreshToken"],
  storage: localStorage
};

const initial: AuthState = {
  authenticationRan: false,
  rememberMe: false,
  refreshToken: null,
  accessToken: null
};

export type AuthAction = ActionType<typeof actions>;

const reducer = createReducer<AuthState, AuthAction>(initial)
  .handleAction(actions.notAuthenticated, (state, _) => {
    return { ...state, authenticationRan: true };
  })
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
    return { ...state, accessToken: action.payload, authenticationRan: true };
  })
  .handleAction(actions.clearAccessToken, (state, _) => {
    return { ...state, accessToken: null };
  })
  .handleAction(actions.clearTokens, (state, _) => {
    return { ...state, refreshToken: null, accessToken: null };
  });

export default persistReducer(persistConfig, reducer);
