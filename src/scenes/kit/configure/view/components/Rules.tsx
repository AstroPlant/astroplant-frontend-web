import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Button, Icon } from "semantic-ui-react";

import { UiSchema } from "react-jsonschema-form";
import { JSONSchema6 } from "json-schema";
import ApiForm from "Components/ApiForm";

import { RootState } from "types";
import { KitConfigurationState } from "modules/kit/reducer";
import { kitConfigurationUpdated } from "modules/kit/actions";

import {
  Kit,
  PeripheralDefinition,
  QuantityType,
  KitsApi,
  KitConfiguration
} from "astroplant-api";
import { AuthConfiguration } from "utils/api";

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
};

const RulesForm = ApiForm<any, KitConfiguration>();

class Rules extends React.Component<Props, State> {
  state = {
    editing: false
  };

  onResponse(response: KitConfiguration) {
    const { kit } = this.props;
    this.setState({ editing: false });
    this.props.kitConfigurationUpdated({
      serial: kit.serial,
      configuration: response
    });
  }

  send(formData: any) {
    const { kit, configuration } = this.props;

    const api = new KitsApi(AuthConfiguration.Instance);
    return api.patchConfiguration({
      kitSerial: kit.serial,
      configurationId: configuration.id,
      patchKitConfiguration: {
        rules: formData
      }
    });
  }

  render() {
    const { configuration, quantityTypes, peripheralDefinitions, t } = this.props;

    if (this.state.editing) {
      const conditionSchema: JSONSchema6 = {
        oneOf: [
          {
            title: "Always",
            type: "null"
          },
          {
            title: "Measurement",
            type: "object",
            properties: {
              peripheral: {
                type: "string",
                enum: Object.values(configuration.peripherals).map(
                  peripheral => peripheral.name
                )
              },
              quantityType: {
                type: "number",
                enum: Object.values(quantityTypes).map(
                  quantityType => quantityType.id
                ),
                enumNames: Object.values(quantityTypes).map(
                  quantityType =>
                    quantityType.physicalQuantity +
                    " in " +
                    quantityType.physicalUnit +
                    (quantityType.physicalUnitSymbol
                      ? " (" + quantityType.physicalUnitSymbol + ")"
                      : "")
                )
              },
              comparison: {
                type: "string",
                enum: ["lt", "eq", "gt"],
                enumNames: ["Less than", "Equal to", "Greater than"]
              },
              value: {
                type: "number"
              }
            },
            required: ["peripheral", "quantityType", "comparison", "value"]
          }
        ]
      } as any;

      let schema: JSONSchema6 = {
        type: "object",
        properties: {}
      };

      let uiSchema: UiSchema = {};

      const commandSchemaGen = (commandSchema: JSONSchema6) =>
        ({
          type: "array",
          items: {
            type: "object",
            properties: {
              time: {
                type: "string",
                format: "time",
                title: "From time"
              },
              conditionalActions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    condition: conditionSchema,
                    actions: {
                      type: "array",
                      items: commandSchema
                    }
                  },
                  required: ["condition", "actions"]
                }
              }
            }
          }
        } as JSONSchema6);

      for (const peripheral of Object.values(configuration.peripherals)) {
        const peripheralDefinition = peripheralDefinitions[
          peripheral.peripheralDefinitionId
        ]!;
        if (peripheralDefinition.commandSchema) {
          schema.properties![peripheral.name] = commandSchemaGen(
            peripheralDefinition.commandSchema as JSONSchema6
          );

          uiSchema[peripheral.name] = {
            items: {
              time: {
                "ui:widget": "TimeWidget"
              }
            }
          };
        }
      }

      return (
        <div>
          <p>{t("rules.explanation")}</p>
          <RulesForm
            schema={schema}
            uiSchema={uiSchema}
            send={this.send.bind(this)}
            onResponse={this.onResponse.bind(this)}
            formData={configuration.rules}
          />
        </div>
      );
    } else {
      return (
        <Button primary onClick={() => this.setState({ editing: true })}>
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
    quantityTypes: state.quantityType.quantityTypes
  };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      kitConfigurationUpdated
    },
    dispatch
  );

export default withTranslation()(connect(
  mapStateToProps,
  mapDispatchToProps
)(Rules));
