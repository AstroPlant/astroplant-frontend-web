import React from "react";
import { useSelector } from "react-redux";
import { FullUser } from "~/types";
import MustBeLoggedIn from "../pages/MustBeLoggedIn";
import Loading from "./Loading";
import { selectMe } from "~/modules/me/reducer";
import { selectAuth } from "~/modules/auth/reducer";

export interface WithAuthentication {
  me: FullUser;
}

/**
 * HOC to inject the authenticated user into the component through the `me` prop
 * if the user is authenticated. If the user is not authenticated, renders the
 * `MustBeLoggedIn` page. If `showLoading` is true and authentication has not been
 * ran yet, shows a loading page.
 */
export function withAuthentication<P extends object>(
  showLoading: boolean = true,
): (
  Component: React.ComponentType<P & WithAuthentication>,
) => React.ComponentType<P> {
  console.debug("Authentication guard instantiated");

  return (Component: React.ComponentType<P & WithAuthentication>) => {
    const GuardComponent = showLoading
      ? awaitAuthenticationRan()(MustBeLoggedIn)
      : MustBeLoggedIn;

    return (props: P) => {
      console.debug("Authentication guard ran");

      const me = useSelector(selectMe)?.details ?? null;

      if (me === null) {
        return <GuardComponent />;
      } else {
        return <Component me={me} {...props} />;
      }
    };
  };
}

/** HOC to wait until authentication has been ran (either successfully
 * authenticating the user, or failing authentication due to missing or invalid
 * credentials or connectivity issues). Waits until
 * state.auth.authenticationRan is true. If the access token is set, also waits
 * until state.me.details is not null (or until the access token is removed as
 * invalid from the store).
 */
export function awaitAuthenticationRan<P extends object>(): (
  Component: React.ComponentType<P>,
) => React.ComponentType<P> {
  return (Component) => {
    return (props: P) => {
      const auth = useSelector(selectAuth) ?? null;
      const me = useSelector(selectMe)?.details ?? null;

      if (auth.authenticationRan && (!auth.accessToken || me !== null)) {
        return <Component {...props} />;
      } else {
        return (
          <>
            <div style={{ height: "2em" }} />
            <Loading />{" "}
          </>
        );
      }
    };
  };
}
