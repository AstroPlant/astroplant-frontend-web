import { StateType, ActionType } from 'typesafe-actions';
import { rootReducer } from "./root";

export type RootState = StateType<typeof rootReducer>;
