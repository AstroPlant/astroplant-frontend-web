import * as types from "./actionTypes";

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

export default function reducer(
  state: AuthState = initial,
  action: any
): AuthState {
  switch (action.type) {
    case types.AUTH_REFRESH_TOKEN_SET:
      return { ...state, refreshToken: action.payload };
    default:
      return state;
  }
}
