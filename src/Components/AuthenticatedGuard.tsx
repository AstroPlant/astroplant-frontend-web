import React, { Component } from "react";
import { connect } from "react-redux";
import { RootState, FullUser } from "types";
import { WithValue, WithOption, withOption } from "./OptionGuard";
import MustBeLoggedIn from "../pages/MustBeLoggedIn";

export interface WithAuthentication {
  me: FullUser;
}

/**
 * HOC to inject the authenticated user into the component through the `me` prop
 * if the user is authenticated. IF the user is not authenticated, renders the
 * `MustBeLoggedIn` page.
 */
export function withAuthentication<P>(): (
  component: React.ComponentType<P & WithAuthentication>
) => React.ComponentType<P & WithOption<FullUser>> {
  return Component =>
    withOption<FullUser, P>(MustBeLoggedIn)(props => {
      const { value, ...rest } = props;
      return <Component {...rest as P} me={value} />;
    });
}
