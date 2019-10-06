import React from "react";
import { connect } from "react-redux";
import { Switch, Route, RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";
import { RootState } from "types";
import { KitState } from "modules/kit/reducer";
import { KitMembership } from "modules/me/reducer";
import Option from "utils/option";
import { withOption, WithValue } from "Components/OptionGuard";
import HeadTitle from "Components/HeadTitle";

import Overview from "./overview";
import Configure from "./configure";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params> & {
  membership: Option<KitMembership>;
};

function Kit(props: Props & WithValue<KitState>) {
  const kit = props.value;
  const { path, url } = props.match;

  const canConfigure = props.membership
    .map(m => m.accessSuper || m.accessConfigure)
    .unwrapOr(false);

  return (
    <>
      <HeadTitle main={kit.name || kit.serial} />
      <Container>
        <Menu pointing secondary>
          <Menu.Item name="Overview" as={NavLink} exact to={`${url}`} />
          {canConfigure && (
            <Menu.Item
              name="Configuration"
              as={NavLink}
              to={`${url}/configure`}
            />
          )}
        </Menu>
        <Switch>
          <Route
            path={`${path}/configure`}
            render={props => <Configure {...props} kit={kit} />}
          />
          <Route render={props => <Overview {...props} kit={kit} />} />
        </Switch>
      </Container>
    </>
  );
}

const mapStateToProps = (state: RootState, ownProps: Props) => {
  const { kitSerial } = ownProps.match.params;
  const option = Option.from(state.kit.kits[kitSerial]);
  const membership = Option.from(state.me.kitMemberships[kitSerial]);

  return {
    option,
    membership
  };
};

export default connect(mapStateToProps)(withOption<KitState, Props>()(Kit));
