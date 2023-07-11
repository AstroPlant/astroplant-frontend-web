import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import compose from "~/utils/compose";
import { withTranslation, WithTranslation } from "react-i18next";

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

class ActivateDeactivate extends React.Component<PInner> {
  onResponse(response: Response<schemas["KitConfiguration"]>) {
    const { kit } = this.props;
    this.props.kitSetAllConfigurationsInactive({ serial: kit.serial });
    this.props.kitConfigurationUpdated({
      serial: kit.serial,
      configuration: response.data,
    });
    alert(
      "Configuration updated. Make sure to restart the kit for the configuration to activate."
    );
  }

  send() {
    const { configuration } = this.props;

    return api.patchConfiguration({
      configurationId: configuration.id,
      patchKitConfiguration: {
        active: !configuration.active,
      },
    });
  }

  render() {
    const { t, kit, configuration } = this.props;

    const kitName = kit.name || "Unnamed";
    const configurationDescription =
      configuration.description || configuration.id;

    if (configuration.active) {
      return (
        <Button
          send={this.send.bind(this)}
          onResponse={this.onResponse.bind(this)}
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
          send={this.send.bind(this)}
          onResponse={this.onResponse.bind(this)}
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
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      kitConfigurationUpdated,
      kitSetAllConfigurationsInactive,
    },
    dispatch
  );

export default compose<PInner, Props>(
  connect(null, mapDispatchToProps),
  withTranslation()
)(ActivateDeactivate);
