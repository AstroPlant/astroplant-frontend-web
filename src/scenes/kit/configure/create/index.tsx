import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Switch, Route, RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container, Segment } from "semantic-ui-react";
import { KitState } from "modules/kit/reducer";

import { JSONSchema6 } from "json-schema";
import ApiForm from "Components/ApiForm";

import { kitConfigurationCreated } from "modules/kit/actions";

import { KitsApi, KitConfiguration } from "astroplant-api";
import { AuthConfiguration } from "utils/api";

type Params = { kitSerial: string };

export type Props = WithTranslation &
  RouteComponentProps<Params> & {
    kit: KitState;
    kitConfigurationCreated: (payload: {
      serial: string;
      configuration: KitConfiguration;
    }) => void;
  };

type State = {
  done: boolean;
  result: any;
};

class CreateConfiguration extends React.Component<Props, State> {
  state = {
    done: false,
    result: null
  };

  onResponse(response: KitConfiguration) {
    const { kit } = this.props;
    this.setState({ done: true, result: response });
    this.props.kitConfigurationCreated({
      serial: kit.details.serial,
      configuration: response
    });
  }

  send(formData: any) {
    const { kit } = this.props;

    const api = new KitsApi(AuthConfiguration.Instance);
    return api.createConfiguration({
      kitSerial: kit.details.serial,
      newKitConfiguration: {
        description: formData.description
      }
    });
  }

  render() {
    const { kit, t } = this.props;
    const { path, url } = this.props.match;

    const schema: JSONSchema6 = {
      type: "object",
      title: "Create configuration",
      required: [],
      properties: {
        description: { type: "string", title: t("common.description") }
      }
    };

    const uiSchema = {};

    const CreateConfigurationForm = ApiForm<any, KitConfiguration>();

    return (
      <Container text>
        <Segment piled padded>
          {this.state.done ? (
            <>done...</>
          ) : (
            <>
              <CreateConfigurationForm
                schema={schema}
                uiSchema={uiSchema}
                send={this.send.bind(this)}
                onResponse={this.onResponse.bind(this)}
              />
            </>
          )}
        </Segment>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      kitConfigurationCreated
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(withTranslation()(CreateConfiguration));
