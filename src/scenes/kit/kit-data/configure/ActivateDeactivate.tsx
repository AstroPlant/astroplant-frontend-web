import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import ApiButton from "~/Components/ApiButton";
import {
  kitSetAllConfigurationsInactive,
  kitConfigurationUpdated,
} from "~/modules/kit/actions";
import { api, Response, schemas } from "~/api";
import { IconPower } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

export type Props = {
  kit: schemas["Kit"];
  configuration: schemas["KitConfigurationWithPeripherals"];
};

const Button = ApiButton<any>();

export default function ActivateDeactivate({ kit, configuration }: Props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onResponse = (response: Response<schemas["KitConfiguration"]>) => {
    dispatch(
      kitSetAllConfigurationsInactive({ serial: kit.serial, kitId: kit.id }),
    );
    dispatch(
      kitConfigurationUpdated({
        serial: kit.serial,
        configuration: response.data,
      }),
    );

    if (response.data.active) {
      alert(
        "Configuration activated. Make sure to restart the kit for the configuration to activate.",
      );
    } else {
      // ensure we're still on this configuration's page after deactivation
      navigate({ search: `?c=${configuration.id}` });
    }
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
        buttonProps={{
          variant: "negative",
          leftAdornment: <IconPower aria-hidden />,
        }}
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
        buttonProps={{
          variant: "positive",
          leftAdornment: <IconPower aria-hidden />,
        }}
        confirm={() => ({
          content: t(
            configuration.neverUsed
              ? "kitConfiguration.activateConfirmNeverUsed"
              : "kitConfiguration.activateConfirm",
            {
              kitName,
              configurationDescription,
            },
          ),
        })}
      />
    );
  }
}
