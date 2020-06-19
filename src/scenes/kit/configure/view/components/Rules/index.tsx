import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Header,
  Segment,
  Divider,
  Button,
  Icon,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import produce from "immer";
import { JSONSchema7 } from "json-schema";

import { RootState } from "types";
import { KitConfigurationState } from "modules/kit/reducer";
import { kitConfigurationUpdated } from "modules/kit/actions";

import {
  Kit,
  Peripheral,
  PeripheralDefinition,
  QuantityType,
  KitsApi,
  KitConfiguration,
} from "astroplant-api";
import { AuthConfiguration } from "utils/api";
import Option from "utils/option";

import {
  FuzzyControl,
  FuzzyRule,
  InputSettings,
  OutputSettings,
} from "./schemas";
import ViewInput from "./components/ViewInput";
import ViewOutput from "./components/ViewOutput";
import ViewRule from "./components/ViewRule";
import AddInput from "./components/AddInput";
import AddOutput from "./components/AddOutput";
import EditInput from "./components/EditInput";
import EditOutput from "./components/EditOutput";
import EditRule from "./components/EditRule";
export type Props = WithTranslation & {
  kit: Kit;
  configuration: KitConfigurationState;
  peripheralDefinitions: { [id: string]: PeripheralDefinition };
  quantityTypes: { [id: string]: QuantityType };
  kitConfigurationUpdated: (kitConfiguration: {
    serial: string;
    configuration: KitConfiguration;
  }) => void;
};

type State = {
  editing: boolean;
  loading: boolean;
  editingInput: Option<[Peripheral, QuantityType]>;
  editingOutput: Option<[Peripheral, string, JSONSchema7]>;
  editingRule: Option<number>;
  inputSettings: any;
  fuzzyControl: FuzzyControl;
};

function parseConfiguration(
  configuration: KitConfigurationState
): FuzzyControl {
  let fuzzyControl: FuzzyControl = { input: {}, output: {}, rules: [] };

  const rules = configuration.controlRules as any;
  try {
    for (const [peripheralName, qtSettings] of Object.entries(
      rules.fuzzyControl.input
    )) {
      fuzzyControl.input[peripheralName] = {};
      for (const [quantityTypeId, settings] of Object.entries(
        qtSettings as any
      )) {
        const {
          nominalRange,
          nominalDeltaRange,
          deltaMeasurements,
          interpolation,
          setpoints,
        } = settings as any;
        fuzzyControl.input[peripheralName][quantityTypeId] = {
          nominalRange,
          nominalDeltaRange,
          deltaMeasurements,
          interpolation,
          setpoints,
        };
      }
    }
    for (const [peripheralName, commandSettings] of Object.entries(
      rules.fuzzyControl.output
    )) {
      fuzzyControl.output[peripheralName] = {};
      for (const [command, settings] of Object.entries(
        commandSettings as any
      )) {
        const { type, continuous } = settings as any;
        fuzzyControl.output[peripheralName][command] = {
          type,
          continuous,
        };
      }
    }
    for (const fuzzyRule of rules.fuzzyControl.rules) {
      let newFuzzyRule: FuzzyRule = {
        condition: [],
        implication: [],
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

        if (!(quantityType in fuzzyControl.input[peripheral])) {
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

        if (!(command in fuzzyControl.output[peripheral])) {
          continue;
        }

        newFuzzyRule.implication.push({
          peripheral,
          command,
          fuzzyVariable,
        });
      }

      if (
        newFuzzyRule.condition.length > 0 ||
        newFuzzyRule.implication.length > 0
      ) {
        fuzzyControl.rules.push(newFuzzyRule);
      }
    }
  } catch (e) {}

  return fuzzyControl;
}

class Rules extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { configuration } = this.props;
    this.state = {
      editing: false,
      loading: false,
      editingInput: Option.none(),
      editingOutput: Option.none(),
      editingRule: Option.none(),
      inputSettings: {},
      fuzzyControl: parseConfiguration(configuration),
    };
  }

  onResponse(response: KitConfiguration) {
    const { kit } = this.props;
    this.setState({ editing: false });
    this.props.kitConfigurationUpdated({
      serial: kit.serial,
      configuration: response,
    });
  }

  send(formData: any) {
    const { configuration } = this.props;

    const api = new KitsApi(AuthConfiguration.Instance);
    return api.patchConfiguration({
      configurationId: configuration.id,
      patchKitConfiguration: {
        controlRules: formData,
      },
    });
  }

  async update(fuzzyControl: FuzzyControl) {
    const { configuration } = this.props;

    this.setState({ loading: true, fuzzyControl });

    const api = new KitsApi(AuthConfiguration.Instance);
    await api
      .patchConfiguration({
        configurationId: configuration.id,
        patchKitConfiguration: {
          controlRules: {
            fuzzyControl,
          },
        },
      })
      .toPromise();
    this.setState({ loading: false });
  }

  addEmptyInput = (peripheral: Peripheral, quantityType: QuantityType) => {
    const fuzzyControl = produce(this.state.fuzzyControl, (draft) => {
      if (!(peripheral.name in draft.input)) {
        draft.input[peripheral.name] = {};
      }
      draft.input[peripheral.name][quantityType.id] = {
        nominalRange: 1.0,
        nominalDeltaRange: 0.1,
        deltaMeasurements: 1,
        interpolation: 15,
        setpoints: [],
      };
    });

    this.setState({
      fuzzyControl,
      editingInput: Option.some([peripheral, quantityType]),
    });
  };

  addEmptyOutput = (
    peripheral: Peripheral,
    command: string,
    schema: JSONSchema7
  ) => {
    const fuzzyControl = produce(this.state.fuzzyControl, (draft) => {
      if (!(peripheral.name in draft.output)) {
        draft.output[peripheral.name] = {};
      }
      draft.output[peripheral.name][command] = {
        type: "continuous",
        continuous: {
          minimal: (schema as any).minimal || 0.0,
          maximal: (schema as any).maximal || 100.0,
        },
      };
    });

    this.setState({
      fuzzyControl,
      editingOutput: Option.some([peripheral, command, schema]),
    });
  };

  addEmptyRule = () => {
    const fuzzyControl = produce(this.state.fuzzyControl, (draft) => {
      draft.rules.push({
        condition: [],
        implication: [],
        activeFrom: "00:00:00",
        activeTo: "23:59:59",
      });
    });

    this.setState({
      fuzzyControl,
      editingRule: Option.some(fuzzyControl.rules.length - 1),
    });
  };

  editInput = (
    peripheral: Peripheral,
    quantityType: QuantityType,
    inputSettings: InputSettings
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

    const fuzzyControl = produce(this.state.fuzzyControl, (draft) => {
      draft.input[peripheral.name][quantityType.id] = inputSettingsSorted;
    });

    this.update(fuzzyControl);
  };

  editOutput = (
    peripheral: Peripheral,
    command: string,
    outputSettings: OutputSettings
  ) => {
    const fuzzyControl = produce(this.state.fuzzyControl, (draft) => {
      draft.output[peripheral.name][command] = outputSettings;
    });

    this.update(fuzzyControl);
  };

  editRule = (index: number, rule: FuzzyRule) => {
    const fuzzyControl = produce(this.state.fuzzyControl, (draft) => {
      draft.rules[index] = rule;
    });

    this.update(fuzzyControl);
  };

  deleteInput = (peripheral: Peripheral, quantityType: QuantityType) => {
    const fuzzyControl = produce(this.state.fuzzyControl, (draft) => {
      delete draft.input[peripheral.name][quantityType.id];
      if (Object.values(draft.input[peripheral.name]).length === 0) {
        delete draft.input[peripheral.name];
      }
    });

    this.update(fuzzyControl);
  };

  deleteOutput = (peripheral: Peripheral, command: string) => {
    const fuzzyControl = produce(this.state.fuzzyControl, (draft) => {
      delete draft.output[peripheral.name][command];
      if (Object.values(draft.output[peripheral.name]).length === 0) {
        delete draft.output[peripheral.name];
      }
    });

    this.update(fuzzyControl);
  };

  deleteRule = (index: number) => {
    const fuzzyControl = produce(this.state.fuzzyControl, (draft) => {
      delete draft.rules[index];
    });

    this.update(fuzzyControl);
  };

  render() {
    const {
      configuration,
      quantityTypes,
      peripheralDefinitions,
      t,
    } = this.props;
    const { fuzzyControl } = this.state;

    let undefinedPeripheralQuantityTypes: [Peripheral, QuantityType][] = [];
    for (const peripheral of Object.values(configuration.peripherals)) {
      const peripheralDefinition = peripheralDefinitions[
        peripheral.peripheralDefinitionId
      ]!;

      for (const quantityType of peripheralDefinition.expectedQuantityTypes!) {
        if (
          !(peripheral.name in fuzzyControl.input) ||
          !(quantityType in fuzzyControl.input[peripheral.name])
        ) {
          undefinedPeripheralQuantityTypes.push([
            peripheral,
            quantityTypes[quantityType]!,
          ]);
        }
      }
    }

    let undefinedPeripheralCommands: [Peripheral, string, JSONSchema7][] = [];
    for (const peripheral of Object.values(configuration.peripherals)) {
      const peripheralDefinition = peripheralDefinitions[
        peripheral.peripheralDefinitionId
      ]!;

      if (!peripheralDefinition.commandSchema) {
        continue;
      }

      const schema = peripheralDefinition.commandSchema as any;
      if (schema.type !== "object") {
        continue;
      }

      for (const [key, val] of Object.entries(schema.properties) as any) {
        if (val.type === "number") {
          if (
            !(peripheral.name in fuzzyControl.output) ||
            !(key in fuzzyControl.output[peripheral.name])
          ) {
            undefinedPeripheralCommands.push([peripheral, key, val]);
          }
        }
      }
    }

    if (this.state.editing) {
      for (const peripheral of Object.values(configuration.peripherals)) {
        const peripheralDefinition = peripheralDefinitions[
          peripheral.peripheralDefinitionId
        ]!;
        if (peripheralDefinition.commandSchema) {
        }
      }

      return (
        <Dimmer.Dimmable blurring>
          <Dimmer active={this.state.loading}>
            <Loader />
          </Dimmer>
          <Header as="h4">
            <Icon name="thermometer" /> Inputs
          </Header>

          {Object.entries(fuzzyControl.input).map(
            ([peripheralName, qtInput]) => (
              <Segment key={peripheralName}>
                <Header as="h4">{peripheralName}</Header>
                {Object.entries(qtInput).map(([quantityTypeId, settings]) => {
                  const peripheral = Object.values(
                    configuration.peripherals
                  ).filter((p) => p.name === peripheralName)[0];
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
                          icon
                          labelPosition="left"
                          onClick={() =>
                            this.setState({
                              editingInput: Option.some([
                                peripheral,
                                quantityType,
                              ]),
                            })
                          }
                        >
                          <Icon name="pencil" />
                          Edit
                        </Button>
                      </div>
                      <Divider />
                    </div>
                  );
                })}
              </Segment>
            )
          )}

          {this.state.editingInput
            .map(([peripheral, quantityType]) => {
              const inputSettings = fuzzyControl.input[peripheral.name]![
                quantityType.id
              ]!;
              return (
                <EditInput
                  peripheral={peripheral}
                  quantityType={quantityType}
                  inputSettings={inputSettings}
                  edit={(peripheral, quantityType, inputSettings) => {
                    this.editInput(peripheral, quantityType, inputSettings);
                    this.setState({ editingInput: Option.none() });
                  }}
                  delete={(peripheral, quantityType) => {
                    this.deleteInput(peripheral, quantityType);
                    this.setState({ editingInput: Option.none() });
                  }}
                  close={() => {
                    this.setState({ editingInput: Option.none() });
                  }}
                />
              );
            })
            .unwrapOrNull()}

          <AddInput
            choices={undefinedPeripheralQuantityTypes}
            add={(peripheral, quantityType) =>
              this.addEmptyInput(peripheral, quantityType)
            }
          />

          <Divider />
          <Header as="h4">
            <Icon name="settings" /> Outputs
          </Header>

          {Object.entries(fuzzyControl.output).map(
            ([peripheralName, commandOutput]) => (
              <Segment key={peripheralName}>
                <Header as="h4">{peripheralName}</Header>
                {Object.entries(commandOutput).map(([command, settings]) => {
                  const peripheral = Object.values(
                    configuration.peripherals
                  ).filter((p) => p.name === peripheralName)[0];
                  const peripheralDefinition =
                    peripheralDefinitions[peripheral.peripheralDefinitionId];
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
                          icon
                          labelPosition="left"
                          onClick={() =>
                            this.setState({
                              editingOutput: Option.some([
                                peripheral,
                                command,
                                schema,
                              ]),
                            })
                          }
                        >
                          <Icon name="pencil" />
                          Edit
                        </Button>
                      </div>
                      <Divider />
                    </div>
                  );
                })}
              </Segment>
            )
          )}

          {this.state.editingOutput
            .map(([peripheral, command, schema]) => {
              const outputSettings = fuzzyControl.output[peripheral.name]![
                command
              ]!;
              return (
                <EditOutput
                  peripheral={peripheral}
                  command={command}
                  outputSettings={outputSettings}
                  schema={schema}
                  edit={(peripheral, command, outputSettings) => {
                    this.editOutput(peripheral, command, outputSettings);
                    this.setState({ editingOutput: Option.none() });
                  }}
                  delete={(peripheral, command) => {
                    this.deleteOutput(peripheral, command);
                    this.setState({ editingOutput: Option.none() });
                  }}
                  close={() => {
                    this.setState({ editingOutput: Option.none() });
                  }}
                />
              );
            })
            .unwrapOrNull()}

          <AddOutput
            choices={undefinedPeripheralCommands}
            add={(peripheral, command, schema) =>
              this.addEmptyOutput(peripheral, command, schema)
            }
          />

          <Divider />
          <Header as="h4">
            <Icon name="balance" /> Rules
          </Header>

          <p>{t("control.explanation")}</p>

          {fuzzyControl.rules.map((rule, index) => (
            <Segment key={index}>
              <Header as="h4">Rule #{index + 1}</Header>
              <ViewRule index={index} fuzzyRule={rule} />
              <div>
                <Button
                  icon
                  labelPosition="left"
                  onClick={() =>
                    this.setState({
                      editingRule: Option.some(index),
                    })
                  }
                >
                  <Icon name="pencil" />
                  Edit
                </Button>
              </div>
              <Divider />
            </Segment>
          ))}

          {this.state.editingRule
            .map((index) => {
              const rule = fuzzyControl.rules[index];
              let conditionChoices: [string, QuantityType][] = [];
              let implicationChoices: [string, string][] = [];
              for (const [peripheralName, qtSettings] of Object.entries(
                fuzzyControl.input
              )) {
                for (const quantityTypeId of Object.keys(qtSettings)) {
                  conditionChoices.push([
                    peripheralName,
                    quantityTypes[quantityTypeId]!,
                  ]);
                }
              }
              for (const [peripheralName, commandSettings] of Object.entries(
                fuzzyControl.output
              )) {
                for (const command of Object.keys(commandSettings)) {
                  implicationChoices.push([peripheralName, command]);
                }
              }
              return (
                <EditRule
                  conditionChoices={conditionChoices}
                  implicationChoices={implicationChoices}
                  fuzzyRule={rule}
                  edit={(fuzzyRule) => {
                    this.editRule(index, fuzzyRule);
                    this.setState({ editingRule: Option.none() });
                  }}
                  delete={() => {
                    this.deleteRule(index);
                    console.warn("delete");
                    this.setState({ editingRule: Option.none() });
                  }}
                  close={() => {
                    this.setState({ editingRule: Option.none() });
                  }}
                />
              );
            })
            .unwrapOrNull()}

          <Button primary onClick={() => this.addEmptyRule()}>
            <Icon name="plus" />
            Add rule
          </Button>
        </Dimmer.Dimmable>
      );
    } else {
      return (
        <Button
          primary
          icon
          labelPosition="left"
          onClick={() => this.setState({ editing: true })}
        >
          <Icon name="pencil" />
          Edit rules
        </Button>
      );
    }
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    peripheralDefinitions: state.peripheralDefinition.definitions,
    quantityTypes: state.quantityType.quantityTypes,
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      kitConfigurationUpdated,
    },
    dispatch
  );

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(Rules)
);
