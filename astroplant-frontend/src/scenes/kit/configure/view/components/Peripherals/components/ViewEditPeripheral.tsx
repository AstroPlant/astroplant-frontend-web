import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Segment, Label, Header, Button, Icon } from "semantic-ui-react";
import validator from "@rjsf/validator-ajv8";

import { KitConfigurationState } from "~/modules/kit/reducer";
import { peripheralDeleted, peripheralUpdated } from "~/modules/kit/actions";
import { Kit, KitsApi, Peripheral } from "astroplant-api";
import { AuthConfiguration } from "~/utils/api";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";

import { JSONSchema7 } from "json-schema";
import ApiForm from "~/Components/ApiForm";
import ApiButton from "~/Components/ApiButton";
import RjsfForm from "~/rjsf-theme-semantic-ui";

import PeripheralDefinitionCard from "~/Components/PeripheralDefinitionCard";
import { useAppDispatch, useAppSelector } from "~/hooks";
import Loading from "~/Components/Loading";

export type Props = {
  kit: Kit;
  configuration: KitConfigurationState;
  peripheral: Peripheral;
};

const PeripheralForm = ApiForm<any, any>();
const DeletePeripheralButton = ApiButton<any>();

export default function ViewEditPeripheral({
  kit,
  configuration: _,
  peripheral,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const peripheralDefinition = useAppSelector((state) =>
    peripheralDefinitionsSelectors.selectById(
      state,
      peripheral.peripheralDefinitionId
    )
  );

  const [editing, setEditing] = useState(false);

  const sendUpdate = (formData: any) => {
    const api = new KitsApi(AuthConfiguration.Instance);
    return api.patchPeripheral({
      peripheralId: peripheral.id,
      patchPeripheral: formData,
    });
  };

  const responseUpdate = (response: Peripheral) => {
    dispatch(
      peripheralUpdated({
        serial: kit.serial,
        peripheral: response,
      })
    );
    setEditing(false);
  };

  const sendDelete = () => {
    const api = new KitsApi(AuthConfiguration.Instance);
    return api.deletePeripheral({
      peripheralId: peripheral.id,
    });
  };

  const responseDelete = () => {
    dispatch(
      peripheralDeleted({
        serial: kit.serial,
        peripheralId: peripheral.id,
      })
    );
  };

  if (!peripheralDefinition) {
    return <Loading />;
  }

  const schema: JSONSchema7 = {
    type: "object",
    required: ["name", "configuration"],
    properties: {
      name: { type: "string", title: t("common.name") },
      configuration: peripheralDefinition.configurationSchema,
    },
  };

  return (
    <Segment padded>
      <Label attached="top">Peripheral #{peripheral.id}</Label>
      <Header>{peripheral.name}</Header>
      <p>Identifier: #{peripheral.id}</p>
      <PeripheralDefinitionCard
        peripheralDefinition={peripheralDefinition}
        fluid
      />
      {editing ? (
        <>
          <PeripheralForm
            schema={schema}
            uiSchema={{}}
            send={sendUpdate}
            onResponse={responseUpdate}
            transform={(formData) => ({
              ...formData,
              peripheralDefinitionId: peripheralDefinition.id,
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
}
