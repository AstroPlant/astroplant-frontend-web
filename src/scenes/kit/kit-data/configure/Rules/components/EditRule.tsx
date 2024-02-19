import { useState, useRef } from "react";
import { produce } from "immer";
import { JSONSchema7 } from "json-schema";
import validator from "@rjsf/validator-ajv8";
import { IconScale } from "@tabler/icons-react";

import RjsfForm from "~/rjsf-theme";

import { FuzzyRule } from "~/control/types";
import {
  hedgeSchema,
  inputFuzzySetSchema,
  outputFuzzySetSchema,
} from "~/control/schemas";
import { schemas } from "~/api";
import { ModalDialog } from "~/Components/ModalDialog";
import { Button } from "~/Components/Button";

export type Props = {
  conditionChoices: [string, schemas["QuantityType"]][];
  implicationChoices: [string, string][];
  scheduleChoices: [string, string][];
  fuzzyRule: FuzzyRule;
  edit: (fuzzyRule: FuzzyRule) => void;
  delete: () => void;
  close: () => void;
};

export const fuzzyRuleConditionSchema: JSONSchema7 = {
  type: "object",
  required: ["negation", "delta", "peripheralQuantityType", "fuzzyVariable"],
  properties: {
    negation: { type: "boolean", default: false },
    hedge: hedgeSchema as unknown as JSONSchema7,
    delta: { type: "boolean", default: false },
    peripheralQuantityType: { type: "string" },
    fuzzyVariable: inputFuzzySetSchema as unknown as JSONSchema7,
  },
};

export const fuzzyRuleImplicationSchema: JSONSchema7 = {
  type: "object",
  required: ["peripheralCommand", "fuzzyVariable"],
  properties: {
    peripheralCommand: { type: "string" },
    fuzzyVariable: outputFuzzySetSchema as unknown as JSONSchema7,
  },
};

export const fuzzyRuleScheduleSchema: JSONSchema7 = {
  type: "object",
  required: ["peripheralCommand", "schedule"],
  properties: {
    peripheralCommand: { type: "string" },
    schedule: { type: "number", format: "integer" },
  },
};

export const fuzzyRuleSchema: JSONSchema7 = {
  type: "object",
  properties: {
    condition: { type: "array", items: fuzzyRuleConditionSchema },
    implication: { type: "array", items: fuzzyRuleImplicationSchema },
    schedules: { type: "array", items: fuzzyRuleScheduleSchema },
    activeFrom: { type: "string", format: "time" },
    activeTo: { type: "string", format: "time" },
  },
};

export default function EditRule(props: Props) {
  const {
    conditionChoices,
    implicationChoices,
    scheduleChoices,
    fuzzyRule: fuzzyRuleGiven,
  } = props;

  const fuzzyRuleAdapted = {
    condition: fuzzyRuleGiven.condition.map(
      ({ peripheral, quantityType, ...rest }) => ({
        ...rest,
        peripheralQuantityType: `${peripheral}-${quantityType}`,
      }),
    ),
    implication: fuzzyRuleGiven.implication.map(
      ({ peripheral, command, ...rest }) => ({
        ...rest,
        peripheralCommand: `${peripheral}-${command}`,
      }),
    ),
    schedules: fuzzyRuleGiven.schedules.map(
      ({ peripheral, command, ...rest }) => ({
        ...rest,
        peripheralCommand: `${peripheral}-${command}`,
      }),
    ),
    activeFrom: fuzzyRuleGiven.activeFrom,
    activeTo: fuzzyRuleGiven.activeTo,
  };
  const [closeEasily, setCloseEasily] = useState(true);
  const [formData, setFormData] = useState(fuzzyRuleAdapted);

  const submitButtonRef = useRef(null);

  const handleClose = () => {
    props.close();
  };

  const handleDelete = () => {
    props.delete();
    handleClose();
  };

  const handleSubmit = (fuzzyRule: any) => {
    fuzzyRule.condition = fuzzyRule.condition.map(
      ({ peripheralQuantityType, ...rest }: any) => {
        const splitIdx = peripheralQuantityType.lastIndexOf("-");
        const peripheral = peripheralQuantityType.substring(0, splitIdx);
        const quantityType = Number(
          peripheralQuantityType.substring(splitIdx + 1),
        );

        return { ...rest, peripheral, quantityType };
      },
    );
    fuzzyRule.implication = fuzzyRule.implication.map(
      ({ peripheralCommand, ...rest }: any) => {
        const splitIdx = peripheralCommand.lastIndexOf("-");
        const peripheral = peripheralCommand.substring(0, splitIdx);
        const command = peripheralCommand.substring(splitIdx + 1);

        return { ...rest, peripheral, command };
      },
    );
    fuzzyRule.schedules = fuzzyRule.schedules.map(
      ({ peripheralCommand, ...rest }: any) => {
        const splitIdx = peripheralCommand.lastIndexOf("-");
        const peripheral = peripheralCommand.substring(0, splitIdx);
        const command = peripheralCommand.substring(splitIdx + 1);

        return { ...rest, peripheral, command };
      },
    );
    props.edit(fuzzyRule);
    handleClose();
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
    schedules: {
      "ui:title": "Output schedule votes",
      "ui:description":
        "If the rule holds, it votes for the listed output schedules. The highest-voted output schedule (per peripheral command) is activated.",
      "ui:disabled": false,
      "ui:help": "",
    },
    activeFrom: {
      "ui:title": "Active from",
      "ui:description": "Time-of-day from which the rule becomes active.",
    },
    activeTo: {
      "ui:title": "Active to",
      "ui:description": "Time-of-day until which the rule is active.",
    },
  };
  const schema = produce(fuzzyRuleSchema, (draft) => {
    if (conditionChoices.length > 0) {
      // @ts-ignore
      draft.properties.condition.items.properties.peripheralQuantityType[
        "enum"
      ] = conditionChoices.map(
        ([peripheral, quantityType]) => `${peripheral}-${quantityType.id}`,
      );
      // @ts-ignore
      draft.properties.condition.items.properties.peripheralQuantityType[
        "enumNames"
      ] = conditionChoices.map(
        ([peripheral, quantityType]) =>
          `${peripheral} - ${quantityType.physicalQuantity} in ${quantityType.physicalUnit}`,
      );
    } else {
      uiSchema.condition["ui:disabled"] = true;
      uiSchema.condition["ui:help"] = "Add inputs to set conditions.";
    }
    if (implicationChoices.length > 0) {
      // @ts-ignore
      draft.properties.implication.items.properties.peripheralCommand["enum"] =
        implicationChoices.map(
          ([peripheral, command]) => `${peripheral}-${command}`,
        );
      // @ts-ignore
      draft.properties.implication.items.properties.peripheralCommand[
        "enumNames"
      ] = implicationChoices.map(
        ([peripheral, command]) => `${peripheral} - ${command}`,
      );
    } else {
      uiSchema.implication["ui:disabled"] = true;
      uiSchema.implication["ui:help"] = "Add outputs to set implications.";
    }
    if (scheduleChoices.length > 0) {
      // @ts-ignore
      draft.properties.schedules.items.properties.peripheralCommand["enum"] =
        scheduleChoices.map(
          ([peripheral, command]) => `${peripheral}-${command}`,
        );
      // @ts-ignore
      draft.properties.schedules.items.properties.peripheralCommand[
        "enumNames"
      ] = scheduleChoices.map(
        ([peripheral, command]) => `${peripheral} - ${command}`,
      );
    } else {
      uiSchema.schedules["ui:disabled"] = true;
      uiSchema.schedules["ui:help"] = "Add outputs to set implications.";
    }
  });

  return (
    <ModalDialog
      open={true}
      onClose={handleClose}
      closeWhenClickedOutside={closeEasily}
      header={
        <>
          <IconScale aria-hidden /> Rule
        </>
      }
      actions={
        <>
          <Button variant="muted" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="negative" onClick={() => handleDelete()}>
            Delete
          </Button>
          <Button
            variant="positive"
            onClick={() => (submitButtonRef.current! as any).click()}
          >
            Submit
          </Button>
        </>
      }
    >
      <p>Please set the rule input conditions and output implications.</p>
      <RjsfForm
        schema={schema}
        uiSchema={uiSchema}
        onSubmit={({ formData }) => handleSubmit(formData)}
        formData={formData}
        onChange={({ formData }) => {
          setCloseEasily(false);
          setFormData(formData);
        }}
        validator={validator}
      >
        <input
          ref={submitButtonRef}
          type="submit"
          style={{ display: "none" }}
        />
      </RjsfForm>
    </ModalDialog>
  );
}
