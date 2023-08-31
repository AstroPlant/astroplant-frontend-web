import { useContext, useMemo } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useAppDispatch, useAppSelector } from "~/hooks";
import {
  KitConfigurationState,
  KitState,
  configurationsById,
} from "~/modules/kit/reducer";
import { default as apiButton } from "~/Components/ApiButton";
import { Response, api, schemas } from "~/api";
import {
  kitConfigurationUpdated,
  kitSetAllConfigurationsInactive,
} from "~/modules/kit/actions";
import { ButtonLink } from "~/Components/Button";

import style from "./Configurations.module.css";
import CreateConfiguration from "./CreateConfiguration";
import {
  IconAsterisk,
  IconCopy,
  IconPlayerPlay,
  IconTrash,
} from "@tabler/icons-react";
import { PermissionsContext } from "./contexts";

const ApiButton = apiButton<any>();

export type ConfigurationsProps = {
  kit: KitState;
};

function ConfigurationRow({
  kit,
  configuration,
  showActivate,
}: {
  kit: KitState;
  configuration: KitConfigurationState;
  showActivate: boolean;
}) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const permissions = useContext(PermissionsContext);

  const onResponse = (response: Response<schemas["KitConfiguration"]>) => {
    dispatch(
      kitSetAllConfigurationsInactive({
        serial: kit.serial,
        kitId: kit.details?.id!,
      }),
    );
    dispatch(
      kitConfigurationUpdated({
        serial: kit.serial,
        configuration: response.data,
      }),
    );
    alert(
      "Configuration updated. Make sure to restart the kit for the configuration to activate.",
    );
  };

  const send = () => {
    return api.patchConfiguration({
      configurationId: configuration.id,
      patchKitConfiguration: {
        active: !configuration.active,
      },
    });
  };

  return (
    <li>
      <div className={style.description}>
        <span className={style.name}>
          <Link to={`../../data?c=${configuration.id}`}>
            {configuration.description || "Unnamed configuration"}
          </Link>
        </span>
        <span className={style.identifier} title="Identifier">
          #{configuration.id}
        </span>
        <span className={style.usageIndicator}>
          {configuration.neverUsed && (
            <span title="Never activated">
              <IconAsterisk aria-hidden size="1em" />
            </span>
          )}
        </span>
      </div>
      <div className={style.actions}>
        <span className={style.view}>
          <ButtonLink
            variant="muted"
            size="small"
            to={`../../data/configuration?c=${configuration.id}`}
          >
            {permissions.editConfiguration && configuration.neverUsed
              ? "Edit"
              : "View"}
          </ButtonLink>
        </span>
        <span className={style.shortcuts}>
          <ButtonLink
            variant="text"
            title="Clone this configuration"
            to={`../../data/configuration/clone?c=${configuration.id}`}
          >
            <IconCopy aria-hidden size="1.5em" />
          </ButtonLink>
          {permissions.editConfiguration && (
            <>
              <ButtonLink
                variant="text"
                title="Delete this configuration"
                to={`../../data/danger?c=${configuration.id}`}
              >
                <IconTrash aria-hidden size="1.5em" />
              </ButtonLink>
              {showActivate && (
                <ApiButton
                  buttonProps={{
                    variant: "text",
                    title: "Activate this configuration",
                  }}
                  send={send}
                  onResponse={onResponse}
                  label={t("common.activate")}
                  confirm={() => ({
                    content: t(
                      configuration.neverUsed
                        ? "kitConfiguration.activateConfirmNeverUsed"
                        : "kitConfiguration.activateConfirm",
                      {
                        kitName: kit.details?.name ?? "Unnamed kit",
                        configurationDescription:
                          configuration.description ?? "Unnamed configuration",
                      },
                    ),
                  })}
                >
                  <IconPlayerPlay aria-hidden size="1.5em" />
                </ApiButton>
              )}
            </>
          )}
        </span>
      </div>
    </li>
  );
}

export function Configurations({ kit }: ConfigurationsProps) {
  let configurations_ = useAppSelector((state) =>
    configurationsById(state, kit.configurations),
  );
  const configurations: KitConfigurationState[] = useMemo(() => {
    return configurations_.filter(
      // This is clearly safe, but the TS checker doesn't actually prove type safety here :/
      // Change the inequality into equality and it still compiles.
      (c): c is KitConfigurationState => c !== undefined,
    );
  }, [configurations_]);

  const activeConfiguration = useMemo(
    () => configurations.find((c) => c.active) ?? null,
    [configurations],
  );
  const inactiveConfigurations = useMemo(
    () => configurations.filter((c) => !c.active) ?? null,
    [configurations],
  );

  return (
    <Routes>
      <Route
        path="/"
        element={
          <article>
            <section className={style.top}>
              <ButtonLink to="create" variant="primary">
                New configuration
              </ButtonLink>
            </section>
            <section className={style.listContainer}>
              <header>
                <h3>Active</h3>
              </header>
              {activeConfiguration ? (
                <ul className={style.list}>
                  <ConfigurationRow
                    key={activeConfiguration.id}
                    kit={kit}
                    configuration={activeConfiguration}
                    showActivate={false}
                  />
                </ul>
              ) : (
                <p>
                  <em>There is no active configuration.</em>
                </p>
              )}
            </section>
            <section className={style.listContainer}>
              <header>
                <h3>Inactive</h3>
              </header>
              {inactiveConfigurations.length > 0 ? (
                <ul className={style.list}>
                  {inactiveConfigurations.map((conf) => (
                    <ConfigurationRow
                      key={conf.id}
                      kit={kit}
                      configuration={conf}
                      showActivate={true}
                    />
                  ))}
                </ul>
              ) : (
                <p>
                  <em>There are no inactive configurations.</em>
                </p>
              )}
            </section>
          </article>
        }
      />
      <Route path="/create" element={<CreateConfiguration kit={kit} />} />
    </Routes>
  );
}
