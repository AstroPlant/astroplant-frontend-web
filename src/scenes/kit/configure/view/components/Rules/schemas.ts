import { JSONSchema7 } from "json-schema";

export type Setpoint = {
  time: string;
  value: number;
};

export type InputSettings = {
  nominalRange: number;
  nominalDeltaRange: number;
  deltaMeasurements: number;
  interpolation: number;
  setpoints: Setpoint[];
};

export type InputFuzzySet =
  | "largeNegative"
  | "smallNegative"
  | "nominal"
  | "smallPositive"
  | "largePositive";

export type ContinuousOutputSettings = {
  minimal: number;
  maximal: number;
};

export type OutputSettings = {
  type: "continuous";
  continuous: ContinuousOutputSettings;
};

export type OutputFuzzySet = "minimal" | "low" | "medium" | "high" | "maximal";

export type Hedge = "very" | "slightly" | null;

export type FuzzyRuleCondition = {
  negation: boolean;
  hedge: Hedge;
  delta: boolean;
  peripheral: string;
  quantityType: number;
  fuzzyVariable: InputFuzzySet;
};

export type FuzzyRuleImplication = {
  peripheral: string;
  command: string;
  fuzzyVariable: OutputFuzzySet;
};

export type FuzzyRule = {
  condition: FuzzyRuleCondition[];
  implication: FuzzyRuleImplication[];
  activeFrom: string;
  activeTo: string;
};

export type FuzzyControl = {
  input: {
    [peripheralName: string]: { [quantityTypeId: string]: InputSettings };
  };
  output: {
    [peripheralName: string]: { [command: string]: OutputSettings };
  };
  rules: FuzzyRule[];
};

export const inputFuzzySetSchema: JSONSchema7 = {
  type: "string",
  enum: [
    "largeNegative",
    "smallNegative",
    "nominal",
    "smallPositive",
    "largePositive",
  ],
};

export const outputFuzzySetSchema: JSONSchema7 = {
  type: "string",
  enum: ["minimal", "low", "medium", "high", "maximal"],
};

export const hedgeSchema: JSONSchema7 = {
  type: "string",
  enum: ["very", "slightly"],
};

export const setpointSchema: JSONSchema7 = {
  type: "object",
  required: ["time", "value"],
  properties: {
    time: {
      type: "string",
      format: "time",
    },
    value: {
      type: "number",
    },
  },
};

export const setpointUiSchema = {
  "ui:title": "Setpoints",
  "ui:description":
    "The active setpoint is that of the most recently passed time. To have the same value the entire day, define exactly one setpoint. If the goal of this input is not to be controlled, but rather to act as some additional input, add a single setpoint with the value set to the middle of the expected value range (e.g., if the input range spans from 0 to 100, set the setpoint to 50, and you'd set the nominal range to e.g. 20).",
  items: {
    time: {
      "ui:title": "Time",
    },
    value: {
      "ui:title": "Value",
    },
  },
};

export const inputSettingsSchema: JSONSchema7 = {
  type: "object",
  required: [
    "nominalRange",
    "nominalDeltaRange",
    "deltaMeasurements",
    "interpolation",
    "setpoints",
  ],
  properties: {
    nominalRange: {
      type: "number",
    },
    nominalDeltaRange: {
      type: "number",
    },
    deltaMeasurements: {
      type: "number",
    },
    interpolation: {
      type: "number",
    },
    setpoints: {
      type: "array",
      items: setpointSchema,
      minItems: 1,
    },
  },
};

export const inputSettingsUiSchema = {
  nominalRange: {
    "ui:title": "Nominal range",
    "ui:description":
      "The range of error from the setpoint deemed nominal. The nominal range spans 40% of the entire error range (overlapping with Small Negative and Small Positive). Small Negative and Small positive peak at 50% of the error range, and Large Negative and Large Positive peak at 100% of the error range. Anything above 100% is clipped, which means that with a nominal range of 1.0, the maximum absolute error measured is 2.5. Anything above is simply clipped to 100% Large error.",
  },
  nominalDeltaRange: {
    "ui:title": "Nominal delta range",
  },
  deltaMeasurements: {
    "ui:title": "Number of delta measurements",
    "ui:description":
      "The amount of meaurements used to compute the measurement delta.",
  },
  interpolation: {
    "ui:title": "Interpolation",
    "ui:description":
      "Within this number of minutes to the next setpoint, the setpoint will be linearly interpolated.",
  },
  setpoints: setpointUiSchema,
};

export const outputSettingsSchema: JSONSchema7 = {
  type: "object",
  properties: {
    type: {
      type: "string",
      enum: ["continuous"],
    },
    continuous: {
      type: "object",
      properties: {
        minimal: {
          type: "number",
        },
        maximal: {
          type: "number",
        },
      },
    },
  },
};

export const outputSettingsUiSchema = {
  continuous: {
    minimal: {
      "ui:title": "Minimal command value",
    },
    maximal: {
      "ui:title": "Maximal command value",
    },
  },
};

export const fuzzyRuleCondition: JSONSchema7 = {
  type: "object",
  properties: {
    negation: { type: "boolean" },
    hedge: hedgeSchema,
    delta: { type: "boolean" },
    peripheral: { type: "string" },
    quantityType: { type: "number" },
    fuzzyVariable: inputFuzzySetSchema,
  },
};

export const fuzzyRuleImplication: JSONSchema7 = {
  type: "object",
  properties: {
    peripheral: { type: "string" },
    command: { type: "string" },
    fuzzyVariable: outputFuzzySetSchema,
  },
};

export const fuzzyRule: JSONSchema7 = {
  type: "object",
  properties: {
    condition: { type: "array", items: fuzzyRuleCondition },
    implication: { type: "array", items: fuzzyRuleImplication },
    activeFrom: { type: "string", format: "time" },
    activeTo: { type: "string", format: "time" },
  },
};

export const fuzzyControlSchema: JSONSchema7 = {
  type: "object",
  properties: {
    input: {
      type: "object",
      additionalProperties: {
        // Peripheral
        type: "object",
        additionalProperties: inputSettingsSchema, // Quantity type
      },
    },
    output: {
      type: "object",
      additionalProperties: {
        // Peripheral
        type: "object",
        additionalProperties: outputSettingsSchema, // Command
      },
    },
    rules: {
      type: "array",
      items: fuzzyRule,
    },
  },
};
