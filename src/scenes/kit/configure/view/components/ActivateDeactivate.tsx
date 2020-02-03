import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { compose } from "recompose";
import { withTranslation, WithTranslation } from "react-i18next";

import ApiButton from "Components/ApiButton";

import { KitConfigurationState } from "modules/kit/reducer";
import {
  kitSetAllConfigurationsInactive,
  kitConfigurationUpdated
} from "modules/kit/actions";

import { Kit, KitsApi, KitConfiguration } from "astroplant-api";
import { AuthConfiguration } from "utils/api";

export type Props = {
  kit: Kit;
  configuration: KitConfigurationState;
};

type PInner = WithTranslation &
  Props & {
    kitConfigurationUpdated: (payload: {
      serial: string;
      configuration: KitConfiguration;
    }) => void;
    kitSetAllConfigurationsInactive: (payload: { serial: string }) => void;
  };

const Button = ApiButton<any>();

class ActivateDeactivate extends React.Component<PInner> {
  onResponse(response: KitConfiguration) {
    const { kit } = this.props;
    this.props.kitSetAllConfigurationsInactive({ serial: kit.serial });
    this.props.kitConfigurationUpdated({
      serial: kit.serial,
      configuration: response
    });
  }

  send() {
    const { kit, configuration } = this.props;

    const api = new KitsApi(AuthConfiguration.Instance);
    return api.patchConfiguration({
      kitSerial: kit.serial,
      configurationId: configuration.id,
      patchKitConfiguration: {
        active: !configuration.active
      }
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
              configurationDescription
            })
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
                configurationDescription
              }
            )
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
      kitSetAllConfigurationsInactive
    },
    dispatch
  );

export default compose<PInner, Props>(
  connect(
    null,
    mapDispatchToProps
  ),
  withTranslation()
)(ActivateDeactivate);
