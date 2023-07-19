import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Segment, Label, Header, Button, Icon } from "semantic-ui-react";
import validator from "@rjsf/validator-ajv8";

import { KitConfigurationState } from "~/modules/kit/reducer";
import { peripheralDeleted, peripheralUpdated } from "~/modules/kit/actions";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";

import { JSONSchema7 } from "json-schema";
import ApiForm from "~/Components/ApiForm";
import ApiButton from "~/Components/ApiButton";
import RjsfForm from "~/rjsf-theme-semantic-ui";

import PeripheralDefinitionCard from "~/Components/PeripheralDefinitionCard";
import { useAppDispatch, useAppSelector } from "~/hooks";
import Loading from "~/Components/Loading";
import { api, schemas, Response } from "~/api";

export type Props = {
  kit: schemas["Kit"];
  configuration: KitConfigurationState;
  peripheral: schemas["Peripheral"];
  readOnly: boolean;
};

const PeripheralForm = ApiForm<any, any>();
const DeletePeripheralButton = ApiButton<any>();

export default function ViewEditPeripheral({
  kit,
  configuration: _,
  peripheral,
  readOnly = false,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const peripheralDefinition = useAppSelector((state) =>
    peripheralDefinitionsSelectors.selectById(
      state,
      peripheral.peripheralDefinitionId,
    ),
  );

  const [editing, setEditing] = useState(false);

  const sendUpdate = (formData: any) => {
    return api.patchPeripheral({
      peripheralId: peripheral.id,
      patchPeripheral: formData,
    });
  };

  const responseUpdate = (response: Response<schemas["Peripheral"]>) => {
    dispatch(
      peripheralUpdated({
        serial: kit.serial,
        peripheral: response.data,
      }),
    );
    setEditing(false);
  };

  const sendDelete = () => {
    return api.deletePeripheral({
      peripheralId: peripheral.id,
    });
  };

  const responseDelete = () => {
    dispatch(
      peripheralDeleted({
        serial: kit.serial,
        kitId: peripheral.kitId,
        kitConfigurationId: peripheral.kitConfigurationId,
        peripheralId: peripheral.id,
      }),
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
      configuration: peripheralDefinition.configurationSchema as object,
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

          {!readOnly && (
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
                  variant: "negative",
                  leftAdornment: <Icon name="delete" />,
                }}
                confirm={() => ({
                  content: t("kitConfiguration.peripherals.deleteConfirm"),
                })}
              >
                Delete
              </DeletePeripheralButton>
            </div>
          )}
        </>
      )}
    </Segment>
  );
}
