import React, { useEffect, useMemo } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { useParams, Routes, Route, Navigate } from "react-router-dom";
import { withTranslation, WithTranslation, Trans } from "react-i18next";
import {
  IconChartBar,
  IconFileDownload,
  IconClipboard,
  IconLockCog,
  IconPrompt,
} from "@tabler/icons-react";

import { useAppSelector } from "~/hooks";
import { schemas } from "~/api";
import compose from "~/utils/compose";
import { Container } from "semantic-ui-react";
import Option from "~/utils/option";

import { awaitAuthenticationRan } from "~/Components/AuthenticatedGuard";
import HeadTitle from "~/Components/HeadTitle";
import Loading from "~/Components/Loading";
import { Menu } from "~/Components/Menu";
import { KitAvatar } from "~/Components/KitAvatar";
import { Badge } from "~/Components/Badge";

import {
  KitState,
  allConfigurationsOfKit,
  kitSelectors,
} from "~/modules/kit/reducer";
import { startWatching, stopWatching, fetchKit } from "~/modules/kit/actions";
import { KitMembership } from "~/modules/me/reducer";
import { KitPermissions, kitPermissionsFromMembership } from "~/permissions";

import {
  KitContext,
  ConfigurationsContext,
  MembershipContext,
  PermissionsContext,
} from "./contexts";
import { KitData } from "./kit-data";
import { Configurations } from "./Configurations";
import Details from "./details";
import Download from "./download";
import Access from "./access";
import Rpc from "./rpc";

import style from "./index.module.css";

type Params = { kitSerial: string };

type Props = WithTranslation & {
  kitState: Option<KitState>;
  membership: Option<KitMembership>;
  fetchKit: (payload: { serial: string }) => void;
  startWatching: (payload: { serial: string }) => void;
  stopWatching: (payload: { serial: string }) => void;
};

type KitDashboardProps = {
  kitState: KitState;
  membership: KitMembership | null;
};

function KitHeader({
  kit,
  permissions,
}: {
  kit: schemas["Kit"];
  permissions: KitPermissions;
}) {
  return (
    <header className={style.header}>
      <div className={style.banner}>
        <div className={style.title}>
          <KitAvatar serial={kit.serial} />
          {kit.name || "Unnamed kit"} / {kit.serial}
          {kit.privacyPublicDashboard && (
            <Badge variant="muted" size="small" text="Public" />
          )}
        </div>
      </div>
      <Menu>
        <Menu.Item link={{ to: "data" }}>
          <IconChartBar aria-hidden />
          Data and configuration
        </Menu.Item>
        {/* currently downloading only requires the View permission (which is always present if the user can see this page), this may change */}
        <Menu.Item link={{ to: "download" }}>
          <IconFileDownload aria-hidden />
          Download
        </Menu.Item>
        <Menu.Item link={{ to: "details" }}>
          <IconClipboard aria-hidden />
          Details
        </Menu.Item>
        {permissions.resetPassword && (
          <Menu.Item link={{ to: "access" }}>
            <IconLockCog aria-hidden />
            Access
          </Menu.Item>
        )}
        {permissions.rpcPeripheralCommandLock && (
          <Menu.Item link={{ to: "rpc" }}>
            <IconPrompt aria-hidden />
            RPC
          </Menu.Item>
        )}
      </Menu>
    </header>
  );
}

const KitDashboard = (props: KitDashboardProps) => {
  const { kitState, membership } = props;

  const kit = kitState.details!;
  const configurations = useAppSelector((state) =>
    allConfigurationsOfKit(state, kit.serial),
  );

  const permissions = useMemo(
    () => kitPermissionsFromMembership(membership),
    [membership],
  );

  if (configurations === null) {
    return <Loading />;
  }

  return (
    <KitContext.Provider value={kit}>
      <ConfigurationsContext.Provider value={configurations}>
        <MembershipContext.Provider value={membership}>
          <PermissionsContext.Provider value={permissions}>
            <KitHeader kit={kit} permissions={permissions} />
            <Routes>
              {/* redirect 404, or should an error message be given? */}
              <Route path="*" element={<Navigate to="data" replace />} />
              <Route path="/data/*" element={<KitData kitState={kitState} />} />
              <Route
                path="/configurations/*"
                element={<Configurations kit={kitState} />}
              />
              <Route path="/details/*" element={<Details />} />
              <Route path="/download" element={<Download />} />
              <Route path="/access" element={<Access />} />
              <Route path="/rpc" element={<Rpc />} />
            </Routes>
          </PermissionsContext.Provider>
        </MembershipContext.Provider>
      </ConfigurationsContext.Provider>
    </KitContext.Provider>
  );
};

const Kit = (props: Props) => {
  const { t, fetchKit, startWatching, stopWatching } = props;
  const { kitSerial: kitSerial_ } = useParams<Params>();
  const kitSerial = kitSerial_!;

  const kit = Option.from(
    useAppSelector((state) => kitSelectors.selectById(state, kitSerial)),
  );
  const membership =
    useAppSelector((state) => state.me.kitMemberships[kitSerial]) ?? null;
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
    return <KitDashboard kitState={kitState} membership={membership} />;
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
            <Trans i18nKey="kit.notFound.body" values={{ serial: kitSerial }}>
              Sorry, the kit with serial <code>{kitSerial}</code> could not be
              found.
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
          <Trans
            i18nKey="kit.notAuthorized.body"
            values={{ serial: kitSerial }}
          >
            Sorry, you are not authorized to access kit with serial
            <code>{kitSerial}</code>. Please ensure you are logged in with the
            correct account.
          </Trans>
        </Container>
      </>
    );
  } else {
    throw new Error("Unknown Kit status");
  }
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      fetchKit,
      startWatching,
      stopWatching,
    },
    dispatch,
  );

export default compose<Props, {}>(
  awaitAuthenticationRan(),
  connect(null, mapDispatchToProps),
  withTranslation(),
)(Kit);
