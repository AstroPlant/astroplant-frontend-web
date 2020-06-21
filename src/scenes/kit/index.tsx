import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Switch, Route, RouteComponentProps } from "react-router";
import { NavLink } from "react-router-dom";
import { withTranslation, WithTranslation, Trans } from "react-i18next";
import { compose } from "recompose";
import { Container, Menu, Icon } from "semantic-ui-react";
import { RootState } from "types";
import Option from "utils/option";
import { awaitAuthenticationRan } from "Components/AuthenticatedGuard";
import { withOption, WithValue } from "Components/OptionGuard";
import HeadTitle from "Components/HeadTitle";
import Loading from "Components/Loading";

import { KitState } from "modules/kit/reducer";
import { startWatching, stopWatching, fetchKit } from "modules/kit/actions";
import { KitMembership } from "modules/me/reducer";

import Overview from "./overview";
import Details from "./details";
import Configure from "./configure";
import Access from "./access";
import Rpc from "./rpc";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params> & {
  fetchKit: (payload: { serial: string }) => void;
};

export type InnerProps = RouteComponentProps<Params> &
  WithTranslation &
  WithValue<KitState> & {
    membership: Option<KitMembership>;
    startWatching: (payload: { serial: string }) => void;
    stopWatching: (payload: { serial: string }) => void;
  };

class KitDashboard extends React.PureComponent<
  InnerProps & WithValue<KitState>
> {
  componentDidMount() {
    const kitState = this.props.value;
    this.props.startWatching({ serial: kitState.details.unwrap().serial });
  }

  componentWillUnmount() {
    const kitState = this.props.value;
    this.props.stopWatching({ serial: kitState.details.unwrap().serial });
  }

  render() {
    const kitState = this.props.value;
    const { path, url } = this.props.match;

    const canConfigure = this.props.membership
      .map((m) => m.accessSuper || m.accessConfigure)
      .unwrapOr(false);
    const canConfigureAccess = this.props.membership
      .map((m) => m.accessSuper)
      .unwrapOr(false);
    const canQueryRpc = this.props.membership
      .map((m) => m.accessSuper)
      .unwrapOr(false);

    const kit = kitState.details.unwrap();
    return (
      <>
        <HeadTitle main={kit.name || kit.serial} />
        <Container>
          <Menu pointing secondary>
            <Menu.Item as={NavLink} exact to={`${url}`}>
              <Icon name="chart bar" />
              Overview
            </Menu.Item>
            <Menu.Item as={NavLink} to={`${url}/details`}>
              <Icon name="clipboard" />
              Details
            </Menu.Item>
            {canConfigure && (
              <Menu.Item as={NavLink} to={`${url}/configure`}>
                <Icon name="setting" />
                Configure
              </Menu.Item>
            )}
            {canConfigureAccess && (
              <Menu.Item as={NavLink} to={`${url}/access`}>
                <Icon name="lock open" />
                Access
              </Menu.Item>
            )}
            {canQueryRpc && (
              <Menu.Item as={NavLink} to={`${url}/rpc`}>
                <Icon name="tty" />
                RPC
              </Menu.Item>
            )}
          </Menu>
          <Switch>
            <Route
              path={`${path}/details`}
              render={(props) => (
                <Details
                  {...props}
                  kit={kitState.details.unwrap()}
                  membership={this.props.membership}
                />
              )}
            />
            <Route
              path={`${path}/configure`}
              render={(props) => <Configure {...props} kitState={kitState} />}
            />
            <Route
              path={`${path}/access`}
              render={(props) => <Access {...props} kitState={kitState} />}
            />
            <Route
              path={`${path}/rpc`}
              render={(props) => <Rpc {...props} kitState={kitState} />}
            />
            <Route
              render={(props) => <Overview {...props} kitState={kitState} />}
            />
          </Switch>
        </Container>
      </>
    );
  }
}

class KitStatusWrapper extends React.PureComponent<
  InnerProps & WithValue<KitState>
> {
  render() {
    const kitState = this.props.value;
    const { kitSerial } = this.props.match.params;
    const { t } = this.props;

    if (
      kitState.status === "Fetched" ||
      (kitState.status === "Fetching" && kitState.details.isSome())
    ) {
      return <KitDashboard {...this.props} />;
    } else if (kitState.status === "None" || kitState.status === "Fetching") {
      return <Loading />;
    } else if (kitState.status === "NotFound") {
      return (
        <>
          <HeadTitle main={t("kit.notFound.header")} />
          <Container text>
            <p>
              <Trans i18nKey="kit.notFound.body">
                Sorry, the kit with serial <code>{{ serial: kitSerial }}</code>{" "}
                could not be found.
              </Trans>
            </p>
          </Container>
        </>
      );
    } else if (kitState.status === "NotAuthorized") {
      return (
        <>
          <HeadTitle main={t("kit.notAuthorized.header")} />
          <Container text>
            <Trans i18nKey="kit.notAuthorized.body">
              Sorry, you are not authorized to access kit with serial{" "}
              <code>{{ serial: kitSerial }}</code>. Please ensure you are logged
              in with the correct account.
            </Trans>
          </Container>
        </>
      );
    } else {
      throw new Error("Unknown Kit status");
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: Props) => {
  const { kitSerial } = ownProps.match.params;
  const option = Option.from(state.kit.kits[kitSerial]);
  const membership = Option.from(state.me.kitMemberships[kitSerial]);

  return {
    option,
    membership,
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      startWatching,
      stopWatching,
    },
    dispatch
  );

const innerKit = compose<InnerProps, Props>(
  connect(mapStateToProps, mapDispatchToProps),
  withOption<KitState, InnerProps>(),
  withTranslation()
)(KitStatusWrapper);

class Kit extends React.PureComponent<Props> {
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
      fetchKit,
    },
    dispatch
  );

export default compose<Props, {}>(
  awaitAuthenticationRan(),
  connect(null, outerMapDispatchToProps)
)(Kit);
