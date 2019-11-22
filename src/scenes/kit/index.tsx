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
import { startWatching, stopWatching, fetchKit } from "modules/kit/actions";
import { KitMembership } from "modules/me/reducer";

import Overview from "./overview";
import Configure from "./configure";
import Access from "./access";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params> & {
  fetchKit: (payload: { serial: string }) => void;
};

export type InnerProps = RouteComponentProps<Params> & {
  membership: Option<KitMembership>;
  startWatching: (payload: { serial: string }) => void;
  stopWatching: (payload: { serial: string }) => void;
};

class InnerKit extends React.Component<InnerProps & WithValue<KitState>> {
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
    const canConfigureAccess = this.props.membership
      .map(m => m.accessSuper)
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
            {canConfigureAccess && (
              <Menu.Item name="Access" as={NavLink} to={`${url}/access`} />
            )}
          </Menu>
          <Switch>
            <Route
              path={`${path}/configure`}
              render={props => <Configure {...props} kit={kit} />}
            />
            <Route
              path={`${path}/access`}
              render={props => <Access {...props} kit={kit} />}
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

const innerKit = connect(
  mapStateToProps,
  mapDispatchToProps
)(withOption<KitState, InnerProps>()(InnerKit));

class Kit extends React.Component<Props> {
    async componentDidMount() {
        this.props.fetchKit({ serial: this.props.match.params.kitSerial });
    }

  render() {
    const K = innerKit;
    return <K {...this.props} />;
  }
}

const outerMapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      fetchKit
    },
    dispatch
  );

export default connect(
  null,
  outerMapDispatchToProps
)(Kit);
