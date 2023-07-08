import React, { useState } from "react";
import { compose } from "recompose";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Segment, Label, Header, Button, Icon } from "semantic-ui-react";
import validator from "@rjsf/validator-ajv8";

import { RootState } from "~/types";
import { KitConfigurationState } from "~/modules/kit/reducer";
import { peripheralDeleted, peripheralUpdated } from "~/modules/kit/actions";
import { Kit, KitsApi, PeripheralDefinition, Peripheral } from "astroplant-api";
import { AuthConfiguration } from "~/utils/api";

import { JSONSchema7 } from "json-schema";
import ApiForm from "~/Components/ApiForm";
import ApiButton from "~/Components/ApiButton";
import RjsfForm from "~/rjsf-theme-semantic-ui";

import PeripheralDefinitionCard from "~/Components/PeripheralDefinitionCard";

export type Props = {
  kit: Kit;
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

const ViewEditPeripheral = (props: PInner) => {
  const [editing, setEditing] = useState(false);

  const { t, kit, configuration, peripheral } = props;

  const sendUpdate = (formData: any) => {
    const api = new KitsApi(AuthConfiguration.Instance);
    return api.patchPeripheral({
      peripheralId: peripheral.id,
      patchPeripheral: formData,
    });
  };

  const responseUpdate = (response: Peripheral) => {
    props.peripheralUpdated({
      serial: kit.serial,
      configurationId: configuration.id,
      peripheral: response,
    });
    setEditing(false);
  };

  const sendDelete = () => {
    const api = new KitsApi(AuthConfiguration.Instance);
    return api.deletePeripheral({
      peripheralId: peripheral.id,
    });
  };

  const responseDelete = () => {
    props.peripheralDeleted({
      serial: kit.serial,
      configurationId: configuration.id,
      peripheralId: peripheral.id,
    });
  };

  const def = props.peripheralDefinitions[peripheral.peripheralDefinitionId];

  const schema: JSONSchema7 = {
    type: "object",
    required: ["name", "configuration"],
    properties: {
      name: { type: "string", title: t("common.name") },
      configuration: def.configurationSchema,
    },
  };

  return (
    <Segment padded>
      <Label attached="top">Peripheral #{peripheral.id}</Label>
      <Header>{peripheral.name}</Header>
      <p>Identifier: #{peripheral.id}</p>
      <PeripheralDefinitionCard peripheralDefinition={def} fluid />
      {editing ? (
        <>
          <PeripheralForm
            schema={schema}
            uiSchema={{}}
            send={sendUpdate}
            onResponse={responseUpdate}
            transform={(formData) => ({
              ...formData,
              peripheralDefinitionId: def.id,
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
            validator={validator}
          >
            <div />
          </RjsfForm>
          <div style={{ overflow: "hidden" }}>
            <Button
              primary
              icon
              labelPosition="left"
              floated="left"
              onClick={() => setEditing(true)}
            >
              <Icon name="pencil" />
              Edit
            </Button>
            <DeletePeripheralButton
              send={sendDelete}
              onResponse={responseDelete}
              buttonProps={{
                negative: true,
                icon: true,
                labelPosition: "right",
                floated: "right",
              }}
              confirm={() => ({
                content: t("kitConfiguration.peripherals.deleteConfirm"),
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
};

const mapStateToProps = (state: RootState) => {
  return {
    peripheralDefinitions: state.peripheralDefinition.entities,
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      peripheralDeleted,
      peripheralUpdated,
    },
    dispatch
  );

export default compose<PInner, Props>(
  connect(mapStateToProps, mapDispatchToProps),
  withTranslation()
)(ViewEditPeripheral);
