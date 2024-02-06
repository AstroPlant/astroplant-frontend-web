import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Header,
  Segment,
  Divider,
  Icon,
  Dimmer,
  Loader,
  Message,
} from "semantic-ui-react";
import { produce } from "immer";
import { JSONSchema7 } from "json-schema";

import { kitConfigurationUpdated } from "~/modules/kit/actions";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";
import { selectors as quantityTypesSelectors } from "~/modules/quantity-type/reducer";
import { Button } from "~/Components/Button";

import Option from "~/utils/option";

import {
  FuzzyControl,
  FuzzyRule,
  InputSettings,
  OutputSettings,
} from "~/control/types";
import {
  validateFuzzyControl,
  validateFuzzyControlErrors,
} from "~/control/schemas";
import ViewInput from "./components/ViewInput";
import ViewOutput from "./components/ViewOutput";
import ViewRule from "./components/ViewRule";
import AddInput from "./components/AddInput";
import AddOutput from "./components/AddOutput";
import EditInput from "./components/EditInput";
import EditOutput from "./components/EditOutput";
import EditRule from "./components/EditRule";
import { firstValueFrom } from "rxjs";
import Loading from "~/Components/Loading";
import { api, schemas } from "~/api";
import {
  IconAdjustmentsHorizontal,
  IconPlus,
  IconTransferIn,
  IconTransferOut,
} from "@tabler/icons-react";
import { useAppSelector } from "~/hooks";

export type Props = {
  kit: schemas["Kit"];
  configuration: schemas["KitConfigurationWithPeripherals"];
  readOnly: boolean;
};

// /** Check whether the fuzzy control references existing peripherals, etc. */
// function checkFuzzyControlReferences(
//   fuzzyControl: FuzzyControl,
//   configuration: KitConfigurationState,
// ): boolean {
//   for (const [pName, qtSettings] of Object.entries(fuzzyControl.input)) {
//     configuration.peripherals;
//     for (const [qtId, _settings] of Object.entries(qtSettings)) {
//     }
//   }
//   return false;
// }

function parseConfiguration(
  configuration: schemas["KitConfigurationWithPeripherals"],
): FuzzyControl {
  const rules = configuration.controlRules as { fuzzyControl?: unknown };

  if (!validateFuzzyControl(rules?.fuzzyControl)) {
    console.debug(
      "Fuzzy control rules failed to validate.",
      validateFuzzyControlErrors(),
    );
    const fuzzyControl: FuzzyControl = { input: {}, output: {}, rules: [] };
    return fuzzyControl;
  }

  let fuzzyControl: FuzzyControl = { input: {}, output: {}, rules: [] };
  for (const [peripheralName, qtSettings] of Object.entries(
    rules.fuzzyControl.input,
  )) {
    fuzzyControl.input[peripheralName] = {};
    for (const [quantityTypeId, settings] of Object.entries(qtSettings)) {
      const {
        nominalRange,
        nominalDeltaRange,
        deltaMeasurements,
        interpolated,
        setpoints,
      } = settings;
      fuzzyControl.input[peripheralName]![quantityTypeId]! = {
        nominalRange,
        nominalDeltaRange,
        deltaMeasurements,
        interpolated,
        setpoints,
      };
    }
  }
  for (const [peripheralName, commandSettings] of Object.entries(
    rules.fuzzyControl.output,
  )) {
    fuzzyControl.output[peripheralName] = {};
    for (const [command, settings] of Object.entries(commandSettings)) {
      const { type, continuous, scheduled } = settings;
      fuzzyControl.output[peripheralName]![command]! = {
        type,
        continuous,
        scheduled,
      };
    }
  }
  for (const fuzzyRule of rules.fuzzyControl.rules) {
    let newFuzzyRule: FuzzyRule = {
      condition: [],
      implication: [],
      schedules: [],
      activeFrom: fuzzyRule.activeFrom,
      activeTo: fuzzyRule.activeTo,
    };

    for (const cond of fuzzyRule.condition) {
      const {
        negation,
        hedge,
        delta,
        peripheral,
        quantityType,
        fuzzyVariable,
      } = cond;

      if (!(peripheral in fuzzyControl.input)) {
        continue;
      }

      if (!(quantityType in fuzzyControl.input[peripheral]!)) {
        continue;
      }

      newFuzzyRule.condition.push({
        negation,
        hedge,
        delta,
        peripheral,
        quantityType,
        fuzzyVariable,
      });
    }

    for (const impl of fuzzyRule.implication) {
      const { peripheral, command, fuzzyVariable } = impl;

      if (!(peripheral in fuzzyControl.output)) {
        continue;
      }

      if (!(command in fuzzyControl.output[peripheral]!)) {
        continue;
      }

      newFuzzyRule.implication.push({
        peripheral,
        command,
        fuzzyVariable,
      });
    }

    for (const sched of fuzzyRule.schedules) {
      const { peripheral, command, schedule } = sched;

      if (!(peripheral in fuzzyControl.output)) {
        continue;
      }

      if (!(command in fuzzyControl.output[peripheral]!)) {
        continue;
      }

      newFuzzyRule.schedules.push({
        peripheral,
        command,
        schedule,
      });
    }

    if (
      newFuzzyRule.condition.length > 0 ||
      newFuzzyRule.implication.length > 0 ||
      newFuzzyRule.schedules.length > 0
    ) {
      fuzzyControl.rules.push(newFuzzyRule);
    }
  }

  return fuzzyControl;
}

export default function Rules({ readOnly, kit: _, configuration }: Props) {
  const { t } = useTranslation();

  const peripheralDefinitions = useAppSelector(
    peripheralDefinitionsSelectors.selectEntities,
  );
  const quantityTypes = useAppSelector(quantityTypesSelectors.selectEntities);

  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editingInput, setEditingInput] = useState<
    [schemas["Peripheral"], schemas["QuantityType"]] | null
  >(null);
  const [editingOutput, setEditingOutput] = useState<
    [schemas["Peripheral"], string, JSONSchema7] | null
  >(null);
  const [editingRule, setEditingRule] = useState<number | null>(null);
  const [fuzzyControl, setFuzzyControl] = useState(
    parseConfiguration(configuration),
  );

  const update = async (fuzzyControl: FuzzyControl) => {
    setLoading(true);
    setFuzzyControl(fuzzyControl);

    await firstValueFrom(
      api.patchConfiguration({
        configurationId: configuration.id,
        patchKitConfiguration: {
          controlRules: {
            fuzzyControl,
          },
        },
      }),
    );

    setLoading(false);
  };

  const addEmptyInput = (
    peripheral: schemas["Peripheral"],
    quantityType: schemas["QuantityType"],
  ) => {
    setFuzzyControl(
      produce(fuzzyControl, (draft) => {
        if (!(peripheral.name in draft.input)) {
          draft.input[peripheral.name] = {};
        }
        draft.input[peripheral.name]![quantityType.id] = {
          nominalRange: 1.0,
          nominalDeltaRange: 0.1,
          deltaMeasurements: 1,
          interpolated: false,
          setpoints: [],
        };
      }),
    );

    setEditingInput([peripheral, quantityType]);
  };

  const addEmptyOutput = (
    peripheral: schemas["Peripheral"],
    command: string,
    schema: JSONSchema7,
  ) => {
    setFuzzyControl(
      produce(fuzzyControl, (draft) => {
        if (!(peripheral.name in draft.output)) {
          draft.output[peripheral.name] = {};
        }
        if (schema.type && schema.type === "number") {
          draft.output[peripheral.name]![command] = {
            type: "continuous",
            continuous: {
              minimal: (schema as any).minimal || 0.0,
              maximal: (schema as any).maximal || 100.0,
            },
          };
        } else {
          draft.output[peripheral.name]![command] = {
            type: "scheduled",
            // @ts-ignore
            scheduled: {
              interpolated: false,
              schedules: [
                {
                  schedule: [{ time: "00:00:00", value: 0 }],
                },
              ],
            },
          };
        }
      }),
    );

    setEditingOutput([peripheral, command, schema]);
  };

  const addEmptyRule = () => {
    setFuzzyControl(
      produce(fuzzyControl, (draft) => {
        draft.rules.push({
          condition: [],
          implication: [],
          schedules: [],
          activeFrom: "00:00:00",
          activeTo: "23:59:59",
        });
      }),
    );

    setEditingRule(fuzzyControl.rules.length);
  };

  const editInput = (
    peripheral: schemas["Peripheral"],
    quantityType: schemas["QuantityType"],
    inputSettings: InputSettings,
  ) => {
    const inputSettingsSorted = produce(inputSettings, (draft) => {
      draft.setpoints.sort((a, b) => {
        if (a.time < b.time) {
          return -1;
        } else if (a.time === b.time) {
          return 0;
        } else {
          return 1;
        }
      });
    });

    update(
      produce(fuzzyControl, (draft) => {
        draft.input[peripheral.name]![quantityType.id] = inputSettingsSorted;
      }),
    );
  };

  const editOutput = (
    peripheral: schemas["Peripheral"],
    command: string,
    outputSettings: OutputSettings,
  ) => {
    update(
      produce(fuzzyControl, (draft) => {
        draft.output[peripheral.name]![command] = outputSettings;
      }),
    );
  };

  const editRule = (index: number, rule: FuzzyRule) => {
    update(
      produce(fuzzyControl, (draft) => {
        draft.rules[index] = rule;
      }),
    );
  };

  const deleteInput = (
    peripheral: schemas["Peripheral"],
    quantityType: schemas["QuantityType"],
  ) => {
    update(
      produce(fuzzyControl, (draft) => {
        delete draft.input[peripheral.name]![quantityType.id];
        if (Object.values(draft.input[peripheral.name]!).length === 0) {
          delete draft.input[peripheral.name];
        }
      }),
    );
  };

  const deleteOutput = (peripheral: schemas["Peripheral"], command: string) => {
    update(
      produce(fuzzyControl, (draft) => {
        delete draft.output[peripheral.name]![command];
        if (Object.values(draft.output[peripheral.name]!).length === 0) {
          delete draft.output[peripheral.name];
        }
      }),
    );
  };

  const deleteRule = (index: number) => {
    update(
      produce(fuzzyControl, (draft) => {
        draft.rules.splice(index, 1);
      }),
    );
  };

  let undefinedPeripheralQuantityTypes: [
    schemas["Peripheral"],
    schemas["QuantityType"],
  ][] = [];
  for (const peripheral of Object.values(configuration.peripherals)) {
    const peripheralDefinition =
      peripheralDefinitions[peripheral.peripheralDefinitionId];

    if (peripheralDefinition === undefined) {
      return <Loading />;
    }

    for (const quantityType of peripheralDefinition.expectedQuantityTypes!) {
      if (
        !(peripheral.name in fuzzyControl.input) ||
        !(quantityType in fuzzyControl.input[peripheral.name]!)
      ) {
        undefinedPeripheralQuantityTypes.push([
          peripheral,
          quantityTypes[quantityType]!,
        ]);
      }
    }
  }

  let undefinedPeripheralCommands: [
    schemas["Peripheral"],
    string,
    JSONSchema7,
  ][] = [];
  for (const peripheral of Object.values(configuration.peripherals)) {
    const peripheralDefinition =
      peripheralDefinitions[peripheral.peripheralDefinitionId]!;

    if (!peripheralDefinition.commandSchema) {
      continue;
    }

    const schema = peripheralDefinition.commandSchema as any;
    if (schema.type !== "object") {
      continue;
    }

    for (const [key, val] of Object.entries(schema.properties) as any) {
      if (
        !(peripheral.name in fuzzyControl.output) ||
        !(key in fuzzyControl.output[peripheral.name]!)
      ) {
        undefinedPeripheralCommands.push([peripheral, key, val]);
      }
    }
  }

  if (expanded) {
    for (const peripheral of Object.values(configuration.peripherals)) {
      const peripheralDefinition =
        peripheralDefinitions[peripheral.peripheralDefinitionId]!;
      if (peripheralDefinition.commandSchema) {
      }
    }

    return (
      <Dimmer.Dimmable blurring>
        <Dimmer active={loading}>
          <Loader />
        </Dimmer>

        {!readOnly && (
          <Message warning>
            <Message.Header>Note</Message.Header>
            <p>
              If you change this configuration's peripherals, existing rules are
              not automatically updated. This is a known limitation, and can be
              improved in the future.
            </p>
            <p>
              This version of the control system requires kit version{" "}
              <strong>1.0.0b7</strong> or higher.
            </p>
          </Message>
        )}

        <Header as="h4" className="flex align-center gap-1">
          <IconTransferIn aria-hidden /> Inputs
        </Header>

        {Object.keys(fuzzyControl.input).length === 0 && (
          <p>
            <strong>No inputs added.</strong>
          </p>
        )}
        {Object.entries(fuzzyControl.input).map(([peripheralName, qtInput]) => (
          <Segment key={peripheralName}>
            <Header as="h4">{peripheralName}</Header>
            {Object.entries(qtInput).map(([quantityTypeId, settings]) => {
              const peripheral = Object.values(
                configuration.peripherals,
              ).filter((p) => p.name === peripheralName)[0]!;
              const quantityType = quantityTypes[quantityTypeId]!;
              return (
                <div key={quantityTypeId}>
                  <ViewInput
                    peripheral={peripheral}
                    quantityType={quantityType}
                    inputSettings={settings}
                  />
                  <div>
                    <Button
                      variant="muted"
                      rightAdornment={<Icon name="pencil" />}
                      onClick={() =>
                        setEditingInput([peripheral, quantityType])
                      }
                    >
                      Edit
                    </Button>
                  </div>
                  <Divider />
                </div>
              );
            })}
          </Segment>
        ))}

        {editingInput !== null &&
          (() => {
            const [peripheral, quantityType] = editingInput;
            const inputSettings =
              fuzzyControl.input[peripheral.name]![quantityType.id]!;
            return (
              <EditInput
                peripheral={peripheral}
                quantityType={quantityType}
                inputSettings={inputSettings}
                edit={(peripheral, quantityType, inputSettings) => {
                  editInput(peripheral, quantityType, inputSettings);
                  setEditingInput(null);
                }}
                delete={(peripheral, quantityType) => {
                  deleteInput(peripheral, quantityType);
                  setEditingInput(null);
                }}
                close={() => {
                  setEditingInput(null);
                }}
              />
            );
          })()}

        {!readOnly && (
          <AddInput
            choices={undefinedPeripheralQuantityTypes}
            add={(peripheral, quantityType) =>
              addEmptyInput(peripheral, quantityType)
            }
          />
        )}

        <Divider />
        <Header as="h4" className="flex align-center gap-1">
          <IconTransferOut aria-hidden /> Outputs
        </Header>

        {Object.keys(fuzzyControl.output).length === 0 && (
          <p>
            <strong>No outputs added.</strong>
          </p>
        )}
        {Object.entries(fuzzyControl.output).map(
          ([peripheralName, commandOutput]) => (
            <Segment key={peripheralName}>
              <Header as="h4">{peripheralName}</Header>
              {Object.entries(commandOutput).map(([command, settings]) => {
                const peripheral = Object.values(
                  configuration.peripherals,
                ).filter((p) => p.name === peripheralName)[0]!;
                const peripheralDefinition =
                  peripheralDefinitions[peripheral.peripheralDefinitionId]!;
                const schema = (peripheralDefinition.commandSchema as any)
                  .properties[command] as JSONSchema7;
                return (
                  <div key={command}>
                    <ViewOutput
                      peripheral={peripheral}
                      command={command}
                      schema={schema}
                      outputSettings={settings}
                    />
                    <div>
                      <Button
                        variant="muted"
                        rightAdornment={<Icon name="pencil" />}
                        onClick={() =>
                          setEditingOutput([peripheral, command, schema])
                        }
                      >
                        Edit
                      </Button>
                    </div>
                    <Divider />
                  </div>
                );
              })}
            </Segment>
          ),
        )}

        {editingOutput !== null &&
          (() => {
            const [peripheral, command, schema] = editingOutput;
            const outputSettings =
              fuzzyControl.output[peripheral.name]![command]!;
            return (
              <EditOutput
                peripheral={peripheral}
                command={command}
                outputSettings={outputSettings}
                schema={schema}
                edit={(peripheral, command, outputSettings) => {
                  editOutput(peripheral, command, outputSettings);
                  setEditingOutput(null);
                }}
                delete={(peripheral, command) => {
                  deleteOutput(peripheral, command);
                  setEditingOutput(null);
                }}
                close={() => {
                  setEditingOutput(null);
                }}
              />
            );
          })()}

        {!readOnly && (
          <AddOutput
            choices={undefinedPeripheralCommands}
            add={(peripheral, command, schema) =>
              addEmptyOutput(peripheral, command, schema)
            }
          />
        )}

        <Divider />
        <Header as="h4" className="flex align-center gap-1">
          <IconAdjustmentsHorizontal aria-hidden /> Rules
        </Header>

        <Message>
          <p>{t("control.explanation")}</p>
        </Message>

        {fuzzyControl.rules.length === 0 && (
          <p>
            <strong>No rules created.</strong>
          </p>
        )}
        {fuzzyControl.rules.map((rule, index) => (
          <Segment key={index}>
            <Header as="h4">Rule #{index + 1}</Header>
            <ViewRule index={index} fuzzyRule={rule} />
            <div>
              <Button
                variant="muted"
                rightAdornment={<Icon name="pencil" />}
                onClick={() => setEditingRule(index)}
              >
                Edit
              </Button>
            </div>
            <Divider />
          </Segment>
        ))}

        {editingRule !== null &&
          (() => {
            const index = editingRule;
            const rule = fuzzyControl.rules[index]!;
            let conditionChoices: [string, schemas["QuantityType"]][] = [];
            let implicationChoices: [string, string][] = [];
            let scheduleChoices: [string, string][] = [];
            for (const [peripheralName, qtSettings] of Object.entries(
              fuzzyControl.input,
            )) {
              for (const quantityTypeId of Object.keys(qtSettings)) {
                conditionChoices.push([
                  peripheralName,
                  quantityTypes[quantityTypeId]!,
                ]);
              }
            }
            for (const [peripheralName, commandSettings] of Object.entries(
              fuzzyControl.output,
            )) {
              for (const [command, settings] of Object.entries(
                commandSettings,
              )) {
                if (settings.type === "continuous") {
                  implicationChoices.push([peripheralName, command]);
                } else if (settings.type === "scheduled") {
                  scheduleChoices.push([peripheralName, command]);
                }
              }
            }
            return (
              <EditRule
                conditionChoices={conditionChoices}
                implicationChoices={implicationChoices}
                scheduleChoices={scheduleChoices}
                fuzzyRule={rule}
                edit={(fuzzyRule) => {
                  editRule(index, fuzzyRule);
                  setEditingRule(null);
                }}
                delete={() => {
                  deleteRule(index);
                  setEditingRule(null);
                }}
                close={() => {
                  setEditingRule(null);
                }}
              />
            );
          })()}

        {!readOnly && (
          <Button
            variant="primary"
            leftAdornment={<IconPlus aria-hidden />}
            onClick={() => addEmptyRule()}
          >
            Add rule
          </Button>
        )}
      </Dimmer.Dimmable>
    );
  } else {
    return (
      <Button
        variant="primary"
        leftAdornment={!readOnly && <Icon name="pencil" />}
        onClick={() => setExpanded(true)}
      >
        {readOnly ? "View rules" : "Edit rules"}
      </Button>
    );
  }
}
