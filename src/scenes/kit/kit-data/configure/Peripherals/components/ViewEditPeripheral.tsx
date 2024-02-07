import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Segment, Label, Header } from "semantic-ui-react";
import validator from "@rjsf/validator-ajv8";
import { IconX, IconPencil } from "@tabler/icons-react";

import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";

import { JSONSchema7 } from "json-schema";
import ApiForm from "~/Components/ApiForm";
import ApiButton from "~/Components/ApiButton";
import RjsfForm from "~/rjsf-theme";

import PeripheralDefinitionCard from "~/Components/PeripheralDefinitionCard";
import { useAppDispatch, useAppSelector } from "~/hooks";
import Loading from "~/Components/Loading";
import { api, schemas, Response } from "~/api";
import { Button } from "~/Components/Button";
import { rtkApi } from "~/services/astroplant";

export type Props = {
  kit: schemas["Kit"];
  configuration: schemas["KitConfigurationWithPeripherals"];
  peripheral: schemas["Peripheral"];
  readOnly: boolean;
};

const PeripheralForm = ApiForm<any, any>;
const DeletePeripheralButton = ApiButton<any>();

export default function ViewEditPeripheral({
  kit,
  configuration,
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

  const [deletePeripheral] = rtkApi.useDeletePeripheralMutation();

  const sendUpdate = (formData: any) => {
    return api.patchPeripheral({
      peripheralId: peripheral.id,
      patchPeripheral: formData,
    });
  };

  const responseUpdate = (_response: Response<schemas["Peripheral"]>) => {
    dispatch(rtkApi.util.invalidateTags(["KitConfigurations"]));
    setEditing(false);
  };

  const responseDelete = () => {
    dispatch(rtkApi.util.invalidateTags(["KitConfigurations"]));
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
            idPrefix={`peripheralForm.${peripheral.id}`}
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
            idPrefix={`peripheralForm.${peripheral.id}`}
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
                variant="primary"
                leftAdornment={<IconPencil aria-hidden />}
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
              <Button
                // send={sendDelete}
                // onResponse={responseDelete}
                variant="negative"
                leftAdornment={<IconX aria-hidden />}
                onClick={() => {
                  console.warn("DELETE");
                }}
                confirm={() => ({
                  content: {
                    header: "Are you sure?",
                    body: t("kitConfiguration.peripherals.deleteConfirm"),
                  },
                })}
              >
                Delete
              </Button>
            </div>
          )}
        </>
      )}
    </Segment>
  );
}
