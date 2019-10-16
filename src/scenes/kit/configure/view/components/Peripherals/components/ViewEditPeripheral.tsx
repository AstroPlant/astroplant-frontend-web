import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Segment,
  Label,
  Container,
  Modal,
  Card,
  Header,
  Button,
  Icon,
  Transition
} from "semantic-ui-react";

import { RootState } from "types";
import { KitState } from "modules/kit/reducer";
import {
  KitsApi,
  KitConfigurationWithPeripherals,
  PeripheralDefinition,
  Peripheral
} from "astroplant-api";
import { AuthConfiguration } from "utils/api";

import { JSONSchema6 } from "json-schema";
import ApiForm from "Components/ApiForm";
import RjsfForm from "rjsf-theme-semantic-ui";

type State = {
  editing: boolean;
};

export type Props = {
  kit: KitState;
  configuration: KitConfigurationWithPeripherals;
  peripheral: Peripheral;
};

type PInner = Props &
  WithTranslation & {
    peripheralDefinitions: { [id: string]: PeripheralDefinition };
  };

const PeripheralForm = ApiForm<any, any>();

class ViewEditPeripheral extends React.Component<PInner, State> {
  state: State = {
    editing: false
  };

  send(formData: any) {
    const { kit, configuration } = this.props;

    const api = new KitsApi(AuthConfiguration.Instance);
    return null as any;
    /*  return api.createPeripheral({
      kitSerial: kit.details.serial,
      configurationId: configuration.id,
      newPeripheral: {
        ...formData,
        peripheralDefinitionId: this.state.peripheralDefinition!.id
      }
    });*/
  }

  onResponse(response: Peripheral) {
    this.setState({ editing: true });
  }

  render() {
    const { t, peripheral } = this.props;
    const def = this.props.peripheralDefinitions[
      peripheral.peripheralDefinitionId
    ];

    const schema: JSONSchema6 = {
      type: "object",
      required: ["name", "configuration"],
      properties: {
        name: { type: "string", title: t("common.name") },
        configuration: def.configurationSchema
      }
    };

    return (
      <Segment padded>
        <Label attached="top">Peripheral #{peripheral.id}</Label>
        <Header>{peripheral.name}</Header>
        <p>Identifier: #{peripheral.id}</p>
        <Card color="blue" fluid>
          <Card.Content>
            <Card.Header>{def.name}</Card.Header>
            {def.description && (
              <Card.Description>{def.description}</Card.Description>
            )}
            <Card.Meta>
              {def.brand} - {def.model}
            </Card.Meta>
          </Card.Content>
        </Card>
        {this.state.editing ? (
          <PeripheralForm
            schema={schema}
            uiSchema={{}}
            send={this.send.bind(this)}
            onResponse={this.onResponse.bind(this)}
            transform={formData => ({
              ...formData,
              peripheralDefinitionId: def.id
            })}
            formData={peripheral}
          />
        ) : (
          <RjsfForm
            schema={schema}
            uiSchema={{}}
            disabled={true}
            formData={peripheral}
          >
            <div />
          </RjsfForm>
        )}
      </Segment>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    peripheralDefinitions: state.peripheralDefinition.definitions
  };
};

export default compose<PInner, Props>(
  connect(mapStateToProps),
  withTranslation()
)(ViewEditPeripheral);
