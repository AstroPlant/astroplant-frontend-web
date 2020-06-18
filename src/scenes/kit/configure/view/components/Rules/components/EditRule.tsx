import React from "react";
import { compose } from "recompose";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Modal, Header, Button, Icon } from "semantic-ui-react";
import produce from "immer";
import { JSONSchema6 } from "json-schema";
import RjsfForm from "rjsf-theme-semantic-ui";

import {
  FuzzyRule,
  hedgeSchema,
  inputFuzzySetSchema,
  outputFuzzySetSchema,
} from "../schemas";
import { QuantityType } from "astroplant-api";

export type Props = {
  conditionChoices: [string, QuantityType][];
  implicationChoices: [string, string][];
  fuzzyRule: FuzzyRule;
  edit: (fuzzyRule: FuzzyRule) => void;
  delete: () => void;
  close: () => void;
};

type PInner = Props & WithTranslation;

type State = {};

export const fuzzyRuleConditionSchema: JSONSchema6 = {
  type: "object",
  properties: {
    negation: { type: "boolean" },
    hedge: hedgeSchema,
    delta: { type: "boolean" },
    peripheralQuantityType: { type: "string" },
    fuzzyVariable: inputFuzzySetSchema,
  },
};

export const fuzzyRuleImplicationSchema: JSONSchema6 = {
  type: "object",
  properties: {
    peripheralCommand: { type: "string" },
    fuzzyVariable: outputFuzzySetSchema,
  },
};

export const fuzzyRuleSchema: JSONSchema6 = {
  type: "object",
  properties: {
    condition: { type: "array", items: fuzzyRuleConditionSchema },
    implication: { type: "array", items: fuzzyRuleImplicationSchema },
    activeFrom: { type: "string", format: "time" },
    activeTo: { type: "string", format: "time" },
  },
};

class EditPeripheral extends React.Component<PInner, State> {
  state: State = {};

  handleClose = () => {
    this.props.close();
  };

  handleDelete = () => {
    this.props.delete();
    this.handleClose();
  };

  handleSubmit = (fuzzyRule: any) => {
    console.warn(fuzzyRule);
    fuzzyRule.condition = fuzzyRule.condition.map(
      ({ peripheralQuantityType, ...rest }: any) => {
        const splitIdx = peripheralQuantityType.lastIndexOf("-");
        const peripheral = peripheralQuantityType.substring(0, splitIdx);
        const quantityType = Number(
          peripheralQuantityType.substring(splitIdx + 1)
        );

        return { ...rest, peripheral, quantityType };
      }
    );
    fuzzyRule.implication = fuzzyRule.implication.map(
      ({ peripheralCommand, ...rest }: any) => {
        const splitIdx = peripheralCommand.lastIndexOf("-");
        const peripheral = peripheralCommand.substring(0, splitIdx);
        const command = peripheralCommand.substring(splitIdx + 1);

        return { ...rest, peripheral, command };
      }
    );
    console.warn(fuzzyRule);
    this.props.edit(fuzzyRule);
    this.handleClose();
  };

  render() {
    const {
      conditionChoices,
      implicationChoices,
      fuzzyRule: fuzzyRuleGiven,
    } = this.props;

    let fuzzyRuleAdapted = {
      condition: fuzzyRuleGiven.condition.map(
        ({ peripheral, quantityType, ...rest }) => ({
          ...rest,
          peripheralQuantityType: `${peripheral}-${quantityType}`,
        })
      ),
      implication: fuzzyRuleGiven.implication.map(
        ({ peripheral, command, ...rest }) => ({
          ...rest,
          peripheralCommand: `${peripheral}-${command}`,
        })
      ),
      activeFrom: fuzzyRuleGiven.activeFrom,
      activeTo: fuzzyRuleGiven.activeTo,
    };

    let uiSchema = {
      condition: {
        "ui:title": "Input conditions",
        "ui:description":
          "All input conditions must be (fuzzily) true for the rule to hold.",
        "ui:disabled": false,
        "ui:help": "",
        items: {
          negation: {
            "ui:title": "Not",
          },
          peripheralQuantityType: {
            "ui:title": "Input",
          },
          fuzzyVariable: {
            "ui:title": "Error or deviation from midpoint",
          },
        },
      },
      implication: {
        "ui:title": "Output implications",
        "ui:description":
          "All output implications are set true if the rule holds.",
        "ui:disabled": false,
        "ui:help": "",
      },
      activeFrom: {
        "ui:title": "Active from",
        "ui:description": "Time-of-day from which the rule becomes active.",
        "ui:widget": "TimeWidget",
      },
      activeTo: {
        "ui:title": "Active to",
        "ui:description": "Time-of-day until which the rule is active.",
        "ui:widget": "TimeWidget",
      },
    };
    const schema = produce(fuzzyRuleSchema, (draft) => {
      if (conditionChoices.length > 0) {
        // @ts-ignore
        draft.properties.condition.items.properties.peripheralQuantityType[
          "enum"
        ] = conditionChoices.map(
          ([peripheral, quantityType]) => `${peripheral}-${quantityType.id}`
        );
        // @ts-ignore
        draft.properties.condition.items.properties.peripheralQuantityType[
          "enumNames"
        ] = conditionChoices.map(
          ([peripheral, quantityType]) =>
            `${peripheral} - ${quantityType.physicalQuantity} in ${quantityType.physicalUnit}`
        );
      } else {
        uiSchema.condition["ui:disabled"] = true;
        uiSchema.condition["ui:help"] = "Add inputs to set conditions.";
      }
      if (implicationChoices.length > 0) {
        // @ts-ignore
        draft.properties.implication.items.properties.peripheralCommand[
          "enum"
        ] = implicationChoices.map(
          ([peripheral, command]) => `${peripheral}-${command}`
        );
        // @ts-ignore
        draft.properties.implication.items.properties.peripheralCommand[
          "enumNames"
        ] = implicationChoices.map(
          ([peripheral, command]) => `${peripheral} - ${command}`
        );
      } else {
        uiSchema.implication["ui:disabled"] = true;
        uiSchema.implication["ui:help"] = "Add outputs to set implications.";
      }
    });

    return (
      <Modal
        closeOnEscape={true}
        closeOnDimmerClick={true}
        open={true}
        onClose={this.handleClose}
      >
        <Modal.Header>
          <Icon name="balance" /> Rule
        </Modal.Header>
        <Modal.Content>
          <Header size="small">
            Please set the rule input conditions and output implications.
          </Header>
          <RjsfForm
            schema={schema}
            uiSchema={uiSchema}
            onSubmit={({ formData }) => this.handleSubmit(formData)}
            formData={fuzzyRuleAdapted}
          >
            <Form.Button type="submit" primary>
              Update
            </Form.Button>
          </RjsfForm>
        </Modal.Content>
        <Modal.Actions>
          <Button secondary onClick={() => this.handleDelete()}>
            Delete
          </Button>
          <Button color="red" onClick={this.handleClose}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default compose<PInner, Props>(withTranslation())(EditPeripheral);
