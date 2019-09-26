import * as types from "./actionTypes";

export interface AuthState {
  rememberMe: boolean;
  jwt: string | null;
}

const initial: AuthState = {
  rememberMe: false,
  jwt: null
};

export default function reducer(
  state: AuthState = initial,
  action: any
): AuthState {
  return state;
}
