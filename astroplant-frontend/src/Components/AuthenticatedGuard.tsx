import React from "react";
import { connect, useSelector } from "react-redux";
import { compose } from "recompose";
import { RootState, FullUser } from "types";
import { WithValue, withOption } from "./OptionGuard";
import MustBeLoggedIn from "../pages/MustBeLoggedIn";
import Loading from "./Loading";
import { selectMe } from "~/modules/me/reducer";

export interface WithAuthentication {
  me: FullUser;
}

const mapStateToProps = (state: RootState) => ({ option: state.me.details });

function withAuthToValue<P extends object>(
  Component: React.ComponentType<P & WithAuthentication>
): React.ComponentType<P & WithValue<FullUser>> {
  return (props) => {
    const { value, ...rest } = props;
    return <Component {...(rest as P)} me={value} />;
  };
}

/**
 * HOC to inject the authenticated user into the component through the `me` prop
 * if the user is authenticated. If the user is not authenticated, renders the
 * `MustBeLoggedIn` page. If `showLoading` is true and authentication has not been
 * ran yet, shows a loading page.
 */
export function withAuthentication<P extends object>(
  showLoading: boolean = true
): (
  Component: React.ComponentType<P & WithAuthentication>
) => React.ComponentType<P> {
  console.debug("Authentication guard instantiated");

  const AuthComponent = (
    Component: React.ComponentType<P & WithAuthentication>
  ) => {
    return (props: P) => {
      console.debug("Authentication guard ran");

      const me = useSelector(selectMe)?.details ?? null;

      if (me === null) {
        return <MustBeLoggedIn />;
      } else {
        return <Component me={me} {...props} />;
      }
    };
  };

  if (showLoading) {
    return compose(awaitAuthenticationRan(), AuthComponent);
  } else {
    return AuthComponent;
  }
}

const mapStateToAwaitAuthenticationProps = (state: RootState) => ({
  auth: state.auth,
  me: state.me,
});

/**
 * HOC to wait until authentication has been ran (either successfully authenticating the
 * user, or failing authentication due to missing or invalid credentials or connectivity
 * issues). Waits until state.auth.authenticationRan is true. If the access token is set,
 * also waits until state.me.details.isSome().
 */
export function awaitAuthenticationRan<P extends object>(): (
  Component: React.ComponentType<P>
) => React.ComponentType<P> {
  return (Component) => {
    // @ts-ignore
    return connect(mapStateToAwaitAuthenticationProps)((props) => {
      // @ts-ignore
      const { auth, me, ...rest } = props;
      if (
        // @ts-ignore
        auth.authenticationRan &&
        // @ts-ignore
        (!auth.accessToken || me.details !== null)
      ) {
        return <Component {...rest} />;
      } else {
        return (
          <>
            <div style={{ height: "2em" }} />
            <Loading />
          </>
        );
      }
    }) as React.ComponentType<P>;
  };
}
