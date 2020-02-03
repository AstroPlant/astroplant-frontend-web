import React from "react";
import { connect } from "react-redux";
import { RootState, FullUser } from "types";
import {
  Container,
  Segment,
  Dimmer,
  Loader,
  Placeholder
} from "semantic-ui-react";
import { WithValue, withOption } from "./OptionGuard";
import MustBeLoggedIn from "../pages/MustBeLoggedIn";

export interface WithAuthentication {
  me: FullUser;
}

const mapStateToProps = (state: RootState) => ({ option: state.me.details });

function withAuthToValue<P>(
  Component: React.ComponentType<P & WithAuthentication>
): React.ComponentType<P & WithValue<FullUser>> {
  return props => {
    const { value, ...rest } = props;
    return <Component {...(rest as P)} me={value} />;
  };
}

/**
 * HOC to inject the authenticated user into the component through the `me` prop
 * if the user is authenticated. IF the user is not authenticated, renders the
 * `MustBeLoggedIn` page.
 */
export function withAuthentication<P>(): (
  Component: React.ComponentType<P & WithAuthentication>
) => React.ComponentType<P> {
  console.info("Authentication guard instantiated");
  return Component => {
    console.info("Authentication guard ran");
    const AuthComponent = withAuthToValue(Component); //: React.ComponentType<P & WithValue<FullUser>> = withAuthToValue<P>(Component);
    const OptionComponent = withOption<FullUser, P>(MustBeLoggedIn)(
      AuthComponent
    );

    // @ts-ignore
    return connect(mapStateToProps)(OptionComponent) as React.ComponentType<P>;
  };
}

const mapStateToAwaitAuthenticationProps = (state: RootState) => ({
  auth: state.auth
});

export function awaitAuthenticationRan<P>(): (
  Component: React.ComponentType<P>
) => React.ComponentType<P> {
  return Component => {
    // @ts-ignore
    return connect(mapStateToAwaitAuthenticationProps)(props => {
      // @ts-ignore
      const { auth, ...rest } = props;
      // @ts-ignore
      if (auth.authenticationRan) {
        return <Component {...rest} />;
      } else {
        return (
          <>
            <div style={{ height: "2em" }} />
            <Container>
              <Segment>
                <Placeholder fluid={true}>
                  <Placeholder.Paragraph>
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Paragraph>
                </Placeholder>
              </Segment>
            </Container>
          </>
        );
      }
    }) as React.ComponentType<P>;
  };
}
