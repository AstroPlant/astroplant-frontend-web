import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Switch, Route, RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import { Container, Menu } from "semantic-ui-react";
import { RootState } from "types";
import Option from "utils/option";
import { withOption, WithValue } from "Components/OptionGuard";
import HeadTitle from "Components/HeadTitle";

import { KitState } from "modules/kit/reducer";
import { startWatching, stopWatching } from "modules/kit/actions";
import { KitMembership } from "modules/me/reducer";

import Overview from "./overview";
import Configure from "./configure";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params> & {
  membership: Option<KitMembership>;
  startWatching: (payload: { serial: string }) => void;
  stopWatching: (payload: { serial: string }) => void;
};

class Kit extends React.Component<Props & WithValue<KitState>> {
  componentWillMount() {
    const kit = this.props.value;
    this.props.startWatching({ serial: kit.details.serial });
  }

  componentWillUnmount() {
    const kit = this.props.value;
    this.props.stopWatching({ serial: kit.details.serial });
  }

  render() {
    const kit = this.props.value;
    const { path, url } = this.props.match;

    const canConfigure = this.props.membership
      .map(m => m.accessSuper || m.accessConfigure)
      .unwrapOr(false);

    return (
      <>
        <HeadTitle main={kit.details.name || kit.details.serial} />
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

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      startWatching,
      stopWatching
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withOption<KitState, Props>()(Kit));
