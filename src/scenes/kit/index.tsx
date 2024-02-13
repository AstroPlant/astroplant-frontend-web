import { useEffect, useMemo } from "react";
import { useParams, Routes, Route, Navigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import {
  IconChartBar,
  IconFileDownload,
  IconClipboard,
  IconLockCog,
  IconPrompt,
} from "@tabler/icons-react";

import { useAppDispatch, useAppSelector } from "~/hooks";
import { schemas } from "~/api";
import compose from "~/utils/compose";
import { Container } from "semantic-ui-react";

import { awaitAuthenticationRan } from "~/Components/AuthenticatedGuard";
import HeadTitle from "~/Components/HeadTitle";
import Loading from "~/Components/Loading";
import { Menu } from "~/Components/Menu";
import { KitAvatar } from "~/Components/KitAvatar";
import { Badge } from "~/Components/Badge";

import { startWatching, stopWatching } from "~/modules/kit/actions";
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
import { rtkApi } from "~/services/astroplant";
import { skipToken } from "@reduxjs/toolkit/query";
import { selectMe } from "~/modules/me/reducer";

type Params = { kitSerial: string };

type KitDashboardProps = {
  kit: schemas["Kit"];
  membership: schemas["KitMembership"] | null;
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
  const { kit, membership } = props;

  const permissions = useMemo(
    () => kitPermissionsFromMembership(membership),
    [membership],
  );

  return (
    <KitContext.Provider value={kit}>
      <MembershipContext.Provider value={membership}>
        <PermissionsContext.Provider value={permissions}>
          <KitHeader kit={kit} permissions={permissions} />
          <Routes>
            {/* redirect 404, or should an error message be given? */}
            <Route path="*" element={<Navigate to="data" replace />} />
            <Route path="/data/*" element={<KitData kit={kit} />} />
            <Route
              path="/configurations/*"
              element={<Configurations kit={kit} />}
            />
            <Route path="/details/*" element={<Details />} />
            <Route path="/download" element={<Download />} />
            <Route path="/access" element={<Access />} />
            <Route path="/rpc" element={<Rpc />} />
          </Routes>
        </PermissionsContext.Provider>
      </MembershipContext.Provider>
    </KitContext.Provider>
  );
};

const Kit = ({}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { kitSerial: kitSerial_ } = useParams<Params>();
  const kitSerial = kitSerial_!;

  const {
    data: kit,
    isLoading: kitLoading,
    isSuccess: kitSuccess,
    error: kitError,
  } = rtkApi.useGetKitQuery({
    kitSerial,
  });

  const username = useAppSelector(selectMe)?.username ?? null;
  const { data: myKitMemberships, isLoading: myKitMembershipsLoading } =
    rtkApi.useGetUserKitMembershipsQuery(
      username !== null ? { username } : skipToken,
    );

  const membership = useMemo(
    () =>
      (myKitMemberships || []).find(
        (membership) => membership.kit.serial === kitSerial,
      ) ?? null,
    [myKitMemberships, kitSerial],
  );

  const kitAccessible = kit !== undefined;
  useEffect(() => {
    if (kitAccessible) {
      dispatch(startWatching({ serial: kitSerial }));
      return () => {
        dispatch(stopWatching({ serial: kitSerial }));
      };
    }
  }, [dispatch, kitAccessible, kitSerial, startWatching, stopWatching]);

  const {
    data: configurations,
    isSuccess: configurationsSuccess,
    isLoading: configurationsLoading,
  } = rtkApi.useGetKitConfigurationsQuery(
    kit === undefined
      ? skipToken
      : {
          kitSerial: kit.serial,
        },
  );
  const configurations_ = useMemo(() => {
    if (configurations === undefined) {
      return;
    }

    const v: { [id: string]: schemas["KitConfigurationWithPeripherals"] } = {};
    for (const conf of configurations) {
      v[conf.id] = conf;
    }
    return v;
  }, [configurations]);

  if (kitSuccess && configurationsSuccess && !myKitMembershipsLoading) {
    return (
      <ConfigurationsContext.Provider value={configurations_!}>
        <KitDashboard kit={kit} membership={membership} />
      </ConfigurationsContext.Provider>
    );
  } else if (kitLoading || configurationsLoading || myKitMembershipsLoading) {
    return <Loading />;
  } else if (
    kitError !== undefined &&
    "type" in kitError &&
    kitError.status === 404
  ) {
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
  } else if (
    kitError !== undefined &&
    "type" in kitError &&
    kitError.status === 401
  ) {
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
    return (
      <>
        <HeadTitle main="Woops" />
        <Container text>
          An unexpected error occurred while trying to access kit with serial{" "}
          <code>{kitSerial}</code>.
        </Container>
      </>
    );
  }
};

export default compose<{}, {}>(awaitAuthenticationRan())(Kit);
