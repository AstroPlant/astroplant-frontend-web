import React, { useEffect } from "react";
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
import HeadTitle from "Components/HeadTitle";
import Loading from "Components/Loading";

import { KitState } from "modules/kit/reducer";
import { startWatching, stopWatching, fetchKit } from "modules/kit/actions";
import { KitMembership } from "modules/me/reducer";

import {
  KitContext,
  ConfigurationsContext,
  MembershipContext,
} from "./contexts";
import Overview from "./overview";
import Details from "./details";
import Configure from "./configure";
import Access from "./access";
import Rpc from "./rpc";

type Params = { kitSerial: string };

type Props = RouteComponentProps<Params> &
  WithTranslation & {
    kitState: Option<KitState>;
    membership: Option<KitMembership>;
    fetchKit: (payload: { serial: string }) => void;
    startWatching: (payload: { serial: string }) => void;
    stopWatching: (payload: { serial: string }) => void;
  };

type InnerKitProps = {
  url: string;
  path: string;
  kitState: KitState;
  membership: Option<KitMembership>;
};

type KitDashboardProps = WithTranslation & InnerKitProps;

const KitDashboard = (props: KitDashboardProps) => {
  const { path, url, kitState, membership } = props;

  const canConfigure = membership
    .map((m) => m.accessSuper || m.accessConfigure)
    .unwrapOr(false);
  const canConfigureAccess = membership
    .map((m) => m.accessSuper)
    .unwrapOr(false);
  const canQueryRpc = membership.map((m) => m.accessSuper).unwrapOr(false);

  const kit = kitState.details!;
  const configurations = kitState.configurations!;
  return (
    <KitContext.Provider value={kit}>
      <ConfigurationsContext.Provider value={configurations}>
        <MembershipContext.Provider value={membership}>
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
                render={(props) => <Details {...props} />}
              />
              <Route
                path={`${path}/configure`}
                render={(props) => <Configure {...props} />}
              />
              <Route
                path={`${path}/access`}
                render={(props) => <Access {...props} />}
              />
              <Route
                path={`${path}/rpc`}
                render={(props) => <Rpc {...props} />}
              />
              <Route
                render={(props) => <Overview {...props} kitState={kitState} />}
              />
            </Switch>
          </Container>
        </MembershipContext.Provider>
      </ConfigurationsContext.Provider>
    </KitContext.Provider>
  );
};

const innerMapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      startWatching,
      stopWatching,
    },
    dispatch
  );

const InnerKit = compose<KitDashboardProps, InnerKitProps>(
  connect(null, innerMapDispatchToProps),
  withTranslation()
)(KitDashboard);

const Kit = (props: Props) => {
  const {
    t,
    kitState: kit,
    membership,
    fetchKit,
    startWatching,
    stopWatching,
  } = props;
  const { kitSerial } = props.match.params;

  useEffect(() => {
    fetchKit({ serial: kitSerial });
  }, [kitSerial, fetchKit]);

  const kitAccessible = kit.map((kit) => kit.details !== null).unwrapOr(false);
  useEffect(() => {
    if (kitAccessible) {
      startWatching({ serial: kitSerial });
      return () => {
        stopWatching({ serial: kitSerial });
      };
    }
  }, [kitAccessible, kitSerial, startWatching, stopWatching]);

  if (kit.isNone()) {
    return <Loading />;
  }
  const kitState = kit.unwrap();

  if (
    (kitState.status === "Fetched" && kitState.configurations !== null) ||
    (kitState.status === "Fetching" &&
      kitState.details !== null &&
      kitState.configurations !== null)
  ) {
    return (
      <InnerKit
        path={props.match.path}
        url={props.match.url}
        kitState={kitState}
        membership={membership}
      />
    );
  } else if (
    kitState.status === "None" ||
    kitState.status === "Fetching" ||
    kitState.configurations === null
  ) {
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
};

const mapStateToProps = (state: RootState, ownProps: Props) => {
  const { kitSerial } = ownProps.match.params;
  const kit = Option.from(state.kit.kits[kitSerial]);
  const membership = Option.from(state.me.kitMemberships[kitSerial]);

  return {
    kitState: kit,
    membership,
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      fetchKit,
      startWatching,
      stopWatching,
    },
    dispatch
  );

export default compose<Props, {}>(
  awaitAuthenticationRan(),
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(Kit);
