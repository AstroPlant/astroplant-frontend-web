import { JSONSchema7 } from "json-schema";

export type Setpoint = {
  time: string;
  value: number;
};

export type InputSettings = {
  nominalRange: number;
  nominalDeltaRange: number;
  deltaMeasurements: number;
  interpolated: boolean;
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

export type ScheduledOutputSettings = {
  interpolated: boolean;
  schedules: Array<{
    schedule: Array<{
      time: string;
      value: number;
    }>;
  }>;
};

export type OutputSettings = {
  type: "continuous" | "scheduled";
  continuous?: ContinuousOutputSettings;
  scheduled?: ScheduledOutputSettings;
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

export type FuzzyRuleSchedule = {
  peripheral: string;
  command: string;
  schedule: number;
};

export type FuzzyRule = {
  condition: FuzzyRuleCondition[];
  implication: FuzzyRuleImplication[];
  schedules: FuzzyRuleSchedule[];
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
  oneOf: [
    { enum: ["largeNegative"], title: "Large negative" },
    { enum: ["smallNegative"], title: "Small negative" },
    { enum: ["nominal"], title: "Nominal" },
    { enum: ["smallPositive"], title: "Small positive" },
    { enum: ["largePositive"], title: "Large positive" },
  ],
};

export const outputFuzzySetSchema: JSONSchema7 = {
  type: "string",
  oneOf: [
    { enum: ["minimal"], title: "Minimal" },
    { enum: ["low"], title: "Low" },
    { enum: ["medium"], title: "Medium" },
    { enum: ["high"], title: "High" },
    { enum: ["maximal"], title: "Maximal" },
  ],
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
    "interpolated",
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
    interpolated: {
      type: "boolean",
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
  interpolated: {
    "ui:title": "Interpolated",
    "ui:help":
      "By interpolating, the setpoint will linearly move from one output value to the next. To have a stable setpoint between two times, e.g. 09:00 and 18:00, set those times to the same setpoint value.",
    "ui:description":
      "When enabled, the setpoint will be linearly interpolated.",
  },
  setpoints: setpointUiSchema,
};

export const outputSettingsScheduleSchema: JSONSchema7 = {
  type: "array",
  items: {
    type: "object",
    required: ["time", "value"],
    properties: {
      time: { type: "string", format: "time" },
      value: {},
    },
  },
  minItems: 1,
};

export const continuousOutputSettingsSchema: JSONSchema7 = {
  type: "object",
  title: "Continuous output settings",
  required: ["minimal", "maximal"],
  properties: {
    minimal: {
      type: "number",
    },
    maximal: {
      type: "number",
    },
  },
};

export const continuousOutputSettingsUiSchema = {
  minimal: {
    "ui:title": "Minimal command value",
  },
  maximal: {
    "ui:title": "Maximal command value",
  },
};

export const scheduledOutputSettingsSchema: JSONSchema7 = {
  type: "object",
  title: "Scheduled output settings",
  required: ["interpolated", "schedules"],
  properties: {
    interpolated: {
      type: "boolean",
      default: false,
    },
    schedules: {
      type: "array",
      title: "Output schedules",
      items: {
        type: "object",
        title: "Schedule",
        required: ["schedule"],
        properties: {
          schedule: outputSettingsScheduleSchema,
        },
      },
      minItems: 1,
    },
  },
};

export const scheduledOutputSettingsUiSchema = {
  interpolated: {
    "ui:help":
      "Interpolation is only possible for numeric commands. By interpolating, the output command will linearly move from one output value to the next. To have a stable output command between two times, e.g. 09:00 and 18:00, set those times to the same command value.",
  },
  schedules: {
    "ui:description":
      "One or more schedules can be defined, with the system switching between them based on the rules you define. If no schedules appear in rules, or no rule matches, the first schedule is used by default.",
  },
};

export const outputSettingsSchema: JSONSchema7 = {
  allOf: [
    {
      type: "object",
      required: ["type"],
      properties: {
        type: { type: "string", enum: ["continuous", "scheduled"] },
      },
    },
    {
      oneOf: [
        {
          type: "object",
          required: ["continuous"],
          properties: { continuous: continuousOutputSettingsSchema },
        },
        {
          type: "object",
          required: ["scheduled"],
          properties: { scheduled: scheduledOutputSettingsSchema },
        },
      ],
    },
  ],
};

export const fuzzyRuleCondition: JSONSchema7 = {
  type: "object",
  required: [
    "negation",
    "delta",
    "peripheral",
    "quantityType",
    "fuzzyVariable",
  ],
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
  required: ["peripheral", "command", "fuzzyVariable"],
  properties: {
    peripheral: { type: "string" },
    command: { type: "string" },
    fuzzyVariable: outputFuzzySetSchema,
  },
};

export const fuzzyRuleSchedule: JSONSchema7 = {
  type: "object",
  required: ["peripheral", "command", "schedule"],
  properties: {
    peripheral: { type: "string" },
    command: { type: "string" },
    schedule: { type: "number", format: "integer" },
  },
};

export const fuzzyRule: JSONSchema7 = {
  type: "object",
  required: ["condition", "implication", "schedules", "activeFrom", "activeTo"],
  properties: {
    condition: { type: "array", items: fuzzyRuleCondition },
    implication: { type: "array", items: fuzzyRuleImplication },
    schedules: { type: "array", items: fuzzyRuleSchedule },
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
