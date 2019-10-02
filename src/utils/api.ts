import { Configuration, Middleware, RequestArgs } from "astroplant-api";
import { Observable } from "rxjs";
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
              Authorization: `Bearer ${token}`,
            },
          };
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
