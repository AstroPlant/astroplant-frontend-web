import { useTranslation } from "react-i18next";
import { Container, Segment, Header, Divider } from "semantic-ui-react";
import { IconCopy } from "@tabler/icons-react";

import Description from "./configure/Description";
import Rules from "./configure/Rules";
import ActivateDeactivate from "./configure/ActivateDeactivate";
import Peripherals from "./configure/Peripherals";
import { Button, ButtonLink } from "~/Components/Button";
import { Navigate, Route, Routes } from "react-router-dom";
import { useContext, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "~/hooks";
import { selectMe } from "~/modules/me/reducer";
import { Select } from "~/Components/Select";
import { rtkApi } from "~/services/astroplant";

import style from "./Configuration.module.css";
import { PermissionsContext } from "../contexts";
import { schemas } from "~/api";
import { skipToken } from "@reduxjs/toolkit/query";
import Loading from "~/Components/Loading";

export type ConfigurationProps = {
  kit: schemas["Kit"];
  configuration: schemas["KitConfigurationWithPeripherals"];
};

function InnerConfiguration({ kit, configuration }: ConfigurationProps) {
  const { t } = useTranslation();
  const permissions = useContext(PermissionsContext);

  return (
    <Container>
      <Segment raised>
        <Header>Description</Header>
        <Description
          kit={kit}
          configuration={configuration}
          readOnly={!permissions.editConfiguration}
        />
      </Segment>
      <Container textAlign="right">
        <ButtonLink
          variant="primary"
          leftAdornment={<IconCopy aria-hidden />}
          to={{ pathname: "clone", search: `?c=${configuration.id}` }}
        >
          Clone
        </ButtonLink>
        <ActivateDeactivate kit={kit} configuration={configuration} />
      </Container>
      <Divider />
      <Container>
        <Header>{t("control.header")}</Header>
        <Rules
          kit={kit}
          configuration={configuration}
          readOnly={!permissions.editConfiguration || !configuration.neverUsed}
        />
      </Container>
      <Divider />
      <Container>
        <Header>Peripherals</Header>
        <Peripherals
          kit={kit}
          configuration={configuration}
          readOnly={!configuration.neverUsed}
        />
      </Container>
    </Container>
  );
}

function Clone({ kit, configuration }: ConfigurationProps) {
  const [cloneConfiguration, result] = rtkApi.useCloneConfigurationMutation();
  const dispatch = useAppDispatch();

  const me = useAppSelector(selectMe);

  const { data: kitMemberships, isLoading: kitMembershipsLoading } =
    rtkApi.useGetUserKitMembershipsQuery(
      me.username !== null
        ? {
            username: me.username,
          }
        : skipToken,
    );

  const defaultTarget: string | null = useMemo(() => {
    const found = (kitMemberships || [])
      .filter(
        (membership) => membership.accessConfigure || membership.accessSuper,
      )
      .find((membership) => membership.kit.serial === kit.serial);
    return found ? kit.serial : null;
  }, [kit, kitMemberships]);

  const [target, setTarget] = useState(defaultTarget);

  useEffect(() => {
    if (target === null) {
      setTarget(defaultTarget);
    }
  }, [target, defaultTarget]);

  if (result.isSuccess) {
    dispatch(rtkApi.util.invalidateTags(["KitConfigurations"]));

    return (
      <Navigate
        to={{
          pathname: `/kit/${target}/data/configuration`,
          search: `?c=${result.data.id}`,
        }}
      />
    );
  }

  if (kitMembershipsLoading) {
    return <Loading />;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.warn(e, target);
        if (target) {
          cloneConfiguration({ kitSerial: target, source: configuration.id });
        }
      }}
    >
      <header>
        <h2>Clone a configuration</h2>
      </header>
      <p>
        Cloning a configuration creates an identical configuration on the target
        kit. Measurements are not cloned.
      </p>
      <p>
        You can clone configurations to kits you have configuration access to.
      </p>
      <div className={style.field}>
        <label>
          Target kit
          <Select
            value={target ?? undefined}
            onChange={(e) => setTarget(e.currentTarget.value)}
            disabled={result.isLoading}
          >
            {(kitMemberships || [])
              .filter((m) => m.accessConfigure || m.accessSuper)
              .map((m) => {
                let name = m.kit.serial;
                let kitName = m.kit.name;
                if (kitName) {
                  name = `${kitName} - ${name}`;
                }
                return (
                  <option key={m.kit.serial} value={m.kit.serial}>
                    {name}
                  </option>
                );
              })}
          </Select>
        </label>
      </div>
      {
        /* TODO: improve error message */
        result.isError && <p className="error">An error occurred.</p>
      }
      <Button type="submit" variant="positive" loading={result.isLoading}>
        Clone configuration
      </Button>
    </form>
  );
}

export default function Configuration({
  kit,
  configuration,
}: ConfigurationProps) {
  return (
    <Routes>
      <Route
        path="*"
        element={<InnerConfiguration kit={kit} configuration={configuration} />}
      />
      <Route
        path="clone"
        element={<Clone kit={kit} configuration={configuration} />}
      />
    </Routes>
  );
}
