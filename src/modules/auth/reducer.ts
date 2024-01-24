import { persistReducer } from "redux-persist";
import localStorage from "redux-persist/lib/storage";
import { createReducer } from "@reduxjs/toolkit";
import * as actions from "./actions";
import { RootState } from "~/types";

export interface AuthState {
  authenticationRan: boolean;
  rememberMe: boolean;
  refreshToken: string | null;
  accessToken: string | null;
}

const persistConfig = {
  key: "auth",
  whitelist: ["rememberMe", "refreshToken"],
  storage: localStorage,
};

const initial: AuthState = {
  authenticationRan: false,
  rememberMe: false,
  refreshToken: null,
  accessToken: null,
};

const reducer = createReducer(initial, (builder) =>
  builder
    .addCase(actions.notAuthenticated, (state, _) => {
      state.authenticationRan = true;
    })
    .addCase(actions.setRememberMe, (state, action) => {
      state.rememberMe = action.payload;
    })
    .addCase(actions.setRefreshToken, (state, action) => {
      state.refreshToken = action.payload.token;
    })
    .addCase(actions.clearRefreshToken, (state, _) => {
      state.refreshToken = null;
    })
    .addCase(actions.setAccessToken, (state, action) => {
      state.accessToken = action.payload;
      state.authenticationRan = true;
    })
    .addCase(actions.clearAccessToken, (state, _) => {
      state.accessToken = null;
    })
    .addCase(actions.clearTokens, (state, _) => {
      state.refreshToken = null;
      state.accessToken = null;
    }),
);

export const selectAuth = (state: RootState): AuthState => state.auth;

export default persistReducer(persistConfig, reducer);
