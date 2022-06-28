import { Configuration, Middleware, RequestArgs } from "astroplant-api";
import { Configuration as MyConfiguration } from "~/api";
import { Observable, pipe, timer, throwError, EMPTY } from "rxjs";
import { retryWhen, mergeMap } from "rxjs/operators";
import RateLimiter from "rxjs-ratelimiter";
import { store } from "~/store";
import { recurse } from "./observables";

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
                ...request.headers,
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
 * Configuration for our manual API implementation.
 */
export const configuration = new MyConfiguration({
  accessToken: () => {
    return store.getState().auth.accessToken;
  },
});

/**
 * Rate-limit observables, by calling rateLimiter.limit() with an observable.
 * E.g.: rateLimiter.limit(of("this is rate limited")). The limits are applied
 * globally, i.e. all observables share the same limit.
 */
export const rateLimiter = new RateLimiter(15, 10000);

/**
 * Utility function to rate-limit observables.
 */
export const rateLimit = <T>(obs: Observable<T>) => rateLimiter.limit<T>(obs);

/**
 * Operator to wrap an observable API call. It provides rate limiting and
 * automatic request retrying for termporal errors.
 */
export function requestWrapper() {
  const MAX_RETRY = 3;
  const RETRY_DELAY_INCREASE = 1000; // In milliseconds.
  const RETRY_DELAY_START = 0; // In milliseconds.
  const TEMPORAL_ERROR_STATUS_CODES = [0, 429, 503, 504];

  return pipe(
    rateLimit,
    retryWhen((errors: Observable<any>) =>
      errors.pipe(
        mergeMap((error: any, i: number) => {
          console.warn("Got an error in requestWrapper:", error, "i:", i);
          if (
            i >= MAX_RETRY ||
            (typeof error.status !== "undefined" &&
              !TEMPORAL_ERROR_STATUS_CODES.includes(error.status))
          ) {
            // We've exhausted our retries or error is non-temporal.
            return throwError(error);
          }

          return timer(i * RETRY_DELAY_INCREASE + RETRY_DELAY_START);
        })
      )
    )
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
        return request(result[result.length - 1].id).pipe(requestWrapper());
      }
    }
  });
}
