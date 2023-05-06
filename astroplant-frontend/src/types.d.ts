import { FullUser } from "./api";
import { rootReducer } from "./root";

export type RootState = ReturnType<typeof rootReducer>;
export type FullUser = FullUser;
