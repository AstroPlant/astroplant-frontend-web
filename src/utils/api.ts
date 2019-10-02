import { Configuration, Middleware, RequestArgs } from "astroplant-api";
import { Observable, pipe, timer, throwError } from "rxjs";
import { retryWhen, mergeMap } from "rxjs/operators";
import RateLimiter from "rxjs-ratelimiter";
import { store } from "store";

export class AuthConfiguration extends Configuration {
  private static config: AuthConfiguration;

  private constructor() {
    const middleware: Middleware[] = [
      {
        pre(request: RequestArgs): RequestArgs {
          const token = store.getState().auth.authenticationToken;

          return {
            ...request,
            headers: {
              ...request.headers,
              Authorization: `Bearer ${token}`
            }
          };
        }
      }
    ];

    super({ middleware });
  }

  public static get Instance() {
    return AuthConfiguration.config || (AuthConfiguration.config = new this());
  }
}

/**
 * Rate-limit observables, by calling rateLimiter.limit() with an observable.
 * E.g.: rateLimiter.limit(of("this is rate limited")). The limits are applied
 * globally, i.e. all observables share the same limit.
 *
 * TODO: Increase limits. This is currently set to a low limit, to more easily
 * spot inefficiencies.
 */
export const rateLimiter = new RateLimiter(2, 2000);

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
