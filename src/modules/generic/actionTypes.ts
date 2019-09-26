export const PAGE_INITIALIZATION_SUCCESS = "PAGE_INITIALIZATION_SUCCESS";
export const PAGE_LOAD_SUCCESS = "PAGE_LOAD_SUCCESS";

interface PageInitializationSuccessAction {
  type: typeof PAGE_INITIALIZATION_SUCCESS;
}

interface PageLoadSuccessAction {
  type: typeof PAGE_LOAD_SUCCESS;
}

export type GenericActionTypes = PageInitializationSuccessAction | PageLoadSuccessAction;
