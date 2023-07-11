import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation, WithTranslation } from "react-i18next";

import ApiButton from "~/Components/ApiButton";
import { KitConfigurationState } from "~/modules/kit/reducer";
import {
  kitSetAllConfigurationsInactive,
  kitConfigurationUpdated,
} from "~/modules/kit/actions";
import { api, Response, schemas } from "~/api";

export type Props = {
  kit: schemas["Kit"];
  configuration: KitConfigurationState;
};

type PInner = WithTranslation &
  Props & {
    kitConfigurationUpdated: (payload: {
      serial: string;
      configuration: schemas["KitConfiguration"];
    }) => void;
    kitSetAllConfigurationsInactive: (payload: { serial: string }) => void;
  };

const Button = ApiButton<any>();

export default function ActivateDeactivate({ kit, configuration }: PInner) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const onResponse = (response: Response<schemas["KitConfiguration"]>) => {
    dispatch(kitSetAllConfigurationsInactive({ serial: kit.serial }));
    dispatch(
      kitConfigurationUpdated({
        serial: kit.serial,
        configuration: response.data,
      })
    );
    alert(
      "Configuration updated. Make sure to restart the kit for the configuration to activate."
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

  const kitName = kit.name || "Unnamed";
  const configurationDescription =
    configuration.description || configuration.id;

  if (configuration.active) {
    return (
      <Button
        send={send}
        onResponse={onResponse}
        label={t("common.deactivate")}
        buttonProps={{ negative: true }}
        confirm={() => ({
          content: t("kitConfiguration.deactivateConfirm", {
            kitName,
            configurationDescription,
          }),
        })}
      />
    );
  } else {
    return (
      <Button
        send={send}
        onResponse={onResponse}
        label={t("common.activate")}
        buttonProps={{ positive: true }}
        confirm={() => ({
          content: t(
            configuration.neverUsed
              ? "kitConfiguration.activateConfirmNeverUsed"
              : "kitConfiguration.activateConfirm",
            {
              kitName,
              configurationDescription,
            }
          ),
        })}
      />
    );
  }
}
