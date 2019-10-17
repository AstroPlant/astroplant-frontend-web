import React from "react";
import { compose } from "recompose";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Grid,
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
import { KitState, KitConfigurationState } from "modules/kit/reducer";
import { peripheralDeleted, peripheralUpdated } from "modules/kit/actions";
import { KitsApi, PeripheralDefinition, Peripheral } from "astroplant-api";
import { AuthConfiguration } from "utils/api";

import { JSONSchema6 } from "json-schema";
import ApiForm from "Components/ApiForm";
import ApiButton from "Components/ApiButton";
import RjsfForm from "rjsf-theme-semantic-ui";

type State = {
  editing: boolean;
};

export type Props = {
  kit: KitState;
  configuration: KitConfigurationState;
  peripheral: Peripheral;
};

type PInner = Props &
  WithTranslation & {
    peripheralDefinitions: { [id: string]: PeripheralDefinition };
    peripheralDeleted: (payload: {
      serial: string;
      configurationId: number;
      peripheralId: number;
    }) => void;
    peripheralUpdated: (payload: {
      serial: string;
      configurationId: number;
      peripheral: Peripheral;
    }) => void;
  };

const PeripheralForm = ApiForm<any, any>();
const DeletePeripheralButton = ApiButton<any>();

class ViewEditPeripheral extends React.Component<PInner, State> {
  state: State = {
    editing: false
  };

  sendUpdate = (formData: any) => {
    const { kit, configuration, peripheral } = this.props;

    const api = new KitsApi(AuthConfiguration.Instance);
    return api.patchPeripheral({
      kitSerial: kit.details.serial,
      configurationId: configuration.id,
      peripheralId: peripheral.id,
      patchPeripheral: formData
    });
  };

  responseUpdate = (response: Peripheral) => {
    const { kit, configuration, peripheral } = this.props;
    this.props.peripheralUpdated({
      serial: kit.details.serial,
      configurationId: configuration.id,
      peripheral: response
    });
    this.setState({ editing: false });
  };

  sendDelete = () => {
    const { kit, configuration, peripheral } = this.props;

    const api = new KitsApi(AuthConfiguration.Instance);
    return api.deletePeripheral({
      kitSerial: kit.details.serial,
      configurationId: configuration.id,
      peripheralId: peripheral.id
    });
  };

  responseDelete = () => {
    const { kit, configuration, peripheral } = this.props;
    this.props.peripheralDeleted({
      serial: kit.details.serial,
      configurationId: configuration.id,
      peripheralId: peripheral.id
    });
  };

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
          <>
            <PeripheralForm
              schema={schema}
              uiSchema={{}}
              send={this.sendUpdate}
              onResponse={this.responseUpdate}
              transform={formData => ({
                ...formData,
                peripheralDefinitionId: def.id
              })}
              formData={peripheral}
            />
          </>
        ) : (
          <>
            <RjsfForm
              schema={schema}
              uiSchema={{}}
              disabled={true}
              formData={peripheral}
            >
              <div />
            </RjsfForm>
            <div style={{ overflow: "hidden" }}>
              <Button
                primary
                icon
                labelPosition="left"
                floated="left"
                onClick={() => this.setState({ editing: true })}
              >
                <Icon name="pencil" />
                Edit
              </Button>
              <DeletePeripheralButton
                send={this.sendDelete}
                onResponse={this.responseDelete}
                buttonProps={{
                  negative: true,
                  icon: true,
                  labelPosition: "right",
                  floated: "right"
                }}
                confirm={() => ({
                  content: t(
                    "kitConfiguration.peripherals.deleteConfirm"
                  )
                })}
              >
                <Icon name="delete" />
                Delete
              </DeletePeripheralButton>
            </div>
          </>
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

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      peripheralDeleted,
      peripheralUpdated
    },
    dispatch
  );

export default compose<PInner, Props>(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withTranslation()
)(ViewEditPeripheral);
