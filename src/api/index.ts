/**
 * This is the AstroPlant API client implementation. It provides utilities such
 * as recursively following pages in Link headers. API requests return an
 * `Observable`: this is an asynchronous datatype similar to a `Promise`, with
 * powerful additional features. Observables for regular requests emit one
 * response and then finish. Observables for recursive requests can emit
 * multiple items before finishing. Observables are inherently retryable and
 * cancelable, so API requests are inherently retryable and cancelable.
 */

import { selectAuth } from "~/modules/auth/reducer";
import { store } from "~/store";

import { Api, Configuration, encodeUri, ErrorResponse } from "./base";

// Re-export
export { encodeUri, ErrorResponse };
export type {
  Response,
  HttpHeaders,
  Meta,
  RequestOptions,
  ErrorDetails,
  schemas,
} from "./base";

/** API configuration automatically fetching the access token from the store. */
const configuration = new Configuration({
  accessToken: () => {
    return selectAuth(store.getState()).accessToken;
  },
});

/** A global API instantiation. It automatically injects the authorization
 * access token fetched from the root store. */
export const api = new Api(configuration);
