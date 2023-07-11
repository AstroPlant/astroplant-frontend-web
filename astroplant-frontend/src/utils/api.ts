import { Configuration, Middleware, RequestArgs } from "astroplant-api";
import {
  Observable,
  EMPTY,
  timer,
  throwError,
  pipe,
  UnaryFunction,
} from "rxjs";
import { retry } from "rxjs/operators";

import { store } from "~/store";
import { recurse } from "./observables";
import { ErrorResponse } from "~/api";

/**
 * Configuration for typescript-rxjs API.
 */
export class AuthConfiguration extends Configuration {
  private static config: AuthConfiguration;

  private constructor() {
    const middleware: Middleware[] = [
      {
        pre(request: RequestArgs): RequestArgs {
          const token = store.getState().auth.accessToken;

          if (token) {
            return {
              ...request,
              headers: {
                ...(request.headers || {}),
                Authorization: `Bearer ${token}`,
              },
            };
          } else {
            return {
              ...request,
            };
          }
        },
      },
    ];

    super({ middleware });
  }

  public static get Instance() {
    return AuthConfiguration.config || (AuthConfiguration.config = new this());
  }
}

/**
 * @deprecated this is a no-op now. Rate-limiting will be moved to the global request handler.
 * Utility function to rate-limit observables.
 */
export const rateLimit = <T = unknown>(obs: Observable<T>) => obs;

/**
 * Operator to wrap an observable API call for automatic reqeust retrying for temporal errors.
 */
// TODO: this used to provide rate-limiting as well. Maybe rename, or maybe it's not needed anymore?
export function requestWrapper<T = unknown>(): UnaryFunction<
  Observable<T>,
  Observable<T>
> {
  const MAX_RETRY = 3;
  const RETRY_DELAY_INCREASE = 1000; // In milliseconds.
  const RETRY_DELAY_START = 0; // In milliseconds.
  const TEMPORAL_ERROR_STATUS_CODES = [0, 429, 503, 504];

  return pipe(
    retry({
      delay: (error: ErrorResponse, retryCount) => {
        if (
          retryCount >= MAX_RETRY ||
          (error.details.status !== undefined &&
            !TEMPORAL_ERROR_STATUS_CODES.includes(error.details.status))
        ) {
          // We've exhausted our retries or error is non-temporal.
          return throwError(() => error);
        }
        return timer(retryCount * RETRY_DELAY_INCREASE + RETRY_DELAY_START);
      },
    })
  );
}

/**
 * Walk over all pages. Assumes request creates an observable yielding exactly
 * one result.
 * TODO: the API returns an x-next header if there is a next page. It would be
 * better to utilize that header.
 */
export function walkPages<T extends { id: number }>(
  request: (page?: number) => Observable<Array<T>>
): Observable<Array<T>> {
  return recurse((result?: Array<T>) => {
    if (typeof result === "undefined") {
      return request().pipe(requestWrapper());
    } else {
      if (result.length === 0) {
        return EMPTY;
      } else {
        return request(result[result.length - 1]!.id).pipe(requestWrapper());
      }
    }
  });
}
