export const SESSION_INITIALIZE = "SESSION_INITIALIZE";

interface InitializeSessionAction {
  type: typeof SESSION_INITIALIZE;
}

export type SessionActionTypes = InitializeSessionAction;
