import { StateType, ActionType } from 'typesafe-actions';
import { rootReducer } from "./root";
import { FullUser } from "./api";

export type RootState = StateType<typeof rootReducer>;
export type FullUser = FullUser;
