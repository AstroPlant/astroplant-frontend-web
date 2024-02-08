import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Segment, Label, Header } from "semantic-ui-react";
import validator from "@rjsf/validator-ajv8";
import { IconX, IconPencil } from "@tabler/icons-react";

import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";

import { JSONSchema7 } from "json-schema";
import { RtkApiForm } from "~/Components/ApiForm";
import RjsfForm from "~/rjsf-theme";

import PeripheralDefinitionCard from "~/Components/PeripheralDefinitionCard";
import { useAppSelector } from "~/hooks";
import Loading from "~/Components/Loading";
import { schemas } from "~/api";
import { Button } from "~/Components/Button";
import { rtkApi } from "~/services/astroplant";
import {
  fuzzyControlDeletePeripheral,
  fuzzyControlRenamePeripheral,
} from "~/control";

export type Props = {
  kit: schemas["Kit"];
  configuration: schemas["KitConfigurationWithPeripherals"];
  peripheral: schemas["Peripheral"];
  readOnly: boolean;
};

export default function ViewEditPeripheral({
  kit,
  configuration,
  peripheral,
  readOnly = false,
}: Props) {
  const { t } = useTranslation();

  const peripheralDefinition = useAppSelector((state) =>
    peripheralDefinitionsSelectors.selectById(
      state,
      peripheral.peripheralDefinitionId,
    ),
  );

  const [editing, setEditing] = useState(false);

  const [patchKitConfiguration] = rtkApi.usePatchKitConfigurationMutation();
  const [patchPeripheral] = rtkApi.usePatchPeripheralMutation();
  const [deletePeripheral] = rtkApi.useDeletePeripheralMutation();

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
          <RtkApiForm
            idPrefix={`peripheralForm.${peripheral.id}`}
            schema={schema}
            uiSchema={{}}
            formData={peripheral}
            onResponse={() => setEditing(false)}
            send={async (data: schemas["Peripheral"]) => {
              if (data.name !== peripheral.name) {
                if (configuration.controlRules) {
                  try {
                    const newFuzzyControl = fuzzyControlRenamePeripheral(
                      (configuration.controlRules as any).fuzzyControl,
                      peripheral.name,
                      data.name,
                    );
                    await patchKitConfiguration({
                      configurationId: configuration.id,
                      patchKitConfiguration: {
                        controlRules: { fuzzyControl: newFuzzyControl },
                      },
                    });
                  } catch {}
                }
              }

              return await patchPeripheral({
                peripheralId: peripheral.id,
                patchPeripheral: data,
              });
            }}
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
                variant="negative"
                leftAdornment={<IconX aria-hidden />}
                onClick={async () => {
                  if (configuration.controlRules) {
                    try {
                      const newFuzzyControl = fuzzyControlDeletePeripheral(
                        (configuration.controlRules as any).fuzzyControl,
                        peripheral.name,
                      );
                      await patchKitConfiguration({
                        configurationId: configuration.id,
                        patchKitConfiguration: {
                          controlRules: { fuzzyControl: newFuzzyControl },
                        },
                      });
                    } catch {}
                  }
                  await deletePeripheral({ peripheralId: peripheral.id });
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
