import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Icon } from "semantic-ui-react";

import { JSONSchema7 } from "json-schema";
import ApiForm from "Components/ApiForm";

import { KitConfigurationState } from "modules/kit/reducer";
import { kitConfigurationUpdated } from "modules/kit/actions";

import { Kit, KitsApi, KitConfiguration } from "astroplant-api";
import { AuthConfiguration } from "utils/api";

export type Props = {
  kit: Kit;
  configuration: KitConfigurationState;
  kitConfigurationUpdated: (kitConfiguration: {
    serial: string;
    configuration: KitConfiguration;
  }) => void;
};

type State = {
  editing: boolean;
};

const DescriptionForm = ApiForm<string, KitConfiguration>();

class Description extends React.Component<Props, State> {
  state = {
    editing: false,
  };

  onResponse(response: KitConfiguration) {
    const { kit } = this.props;
    this.setState({ editing: false });
    this.props.kitConfigurationUpdated({
      serial: kit.serial,
      configuration: response,
    });
  }

  send(formData: string) {
    const { configuration } = this.props;

    const api = new KitsApi(AuthConfiguration.Instance);
    return api.patchConfiguration({
      configurationId: configuration.id,
      patchKitConfiguration: {
        description: formData,
      },
    });
  }

  render() {
    const { configuration } = this.props;

    if (this.state.editing) {
      const schema: JSONSchema7 = {
        type: "string",
      };
      const uiSchema = {};

      return (
        <div>
          <DescriptionForm
            schema={schema}
            uiSchema={uiSchema}
            send={this.send.bind(this)}
            onResponse={this.onResponse.bind(this)}
            formData={configuration.description}
          />
        </div>
      );
    } else {
      return (
        <div onClick={() => this.setState({ editing: true })}>
          <Icon name="pencil" />
          {configuration.description}
        </div>
      );
    }
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      kitConfigurationUpdated,
    },
    dispatch
  );

export default connect(null, mapDispatchToProps)(Description);
