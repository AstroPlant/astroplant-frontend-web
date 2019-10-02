import { store } from "./store";
import { Configuration, Middleware, RequestArgs } from "astroplant-api";

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
