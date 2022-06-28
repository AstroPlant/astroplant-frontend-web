import { rootReducer } from "./root";
import { FullUser } from "./api";

export type RootState = ReturnType<typeof rootReducer>;
export type FullUser = FullUser;
