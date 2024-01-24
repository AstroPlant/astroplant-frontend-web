import Ajv from "ajv";
import addFormats from "ajv-formats";
import { JSONSchema, FromSchema } from "json-schema-to-ts";

import { FuzzyControl } from "./types";

export const inputFuzzySetSchema = {
  type: "string",
  oneOf: [
    { enum: ["largeNegative"], title: "Large negative" },
    { enum: ["smallNegative"], title: "Small negative" },
    { enum: ["nominal"], title: "Nominal" },
    { enum: ["smallPositive"], title: "Small positive" },
    { enum: ["largePositive"], title: "Large positive" },
  ],
} as const satisfies JSONSchema;

export const outputFuzzySetSchema = {
  type: "string",
  oneOf: [
    { enum: ["minimal"], title: "Minimal" },
    { enum: ["low"], title: "Low" },
    { enum: ["medium"], title: "Medium" },
    { enum: ["high"], title: "High" },
    { enum: ["maximal"], title: "Maximal" },
  ],
} as const satisfies JSONSchema;

export const hedgeSchema = {
  type: ["string", "null"],
  enum: ["very", "slightly", null],
} as const satisfies JSONSchema;

export const setpointSchema = {
  type: "object",
  required: ["time", "value"],
  additionalProperties: false,
  properties: {
    time: {
      type: "string",
      format: "time",
    },
    value: {
      type: "number",
    },
  },
} as const satisfies JSONSchema;

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

export const inputSettingsSchema = {
  type: "object",
  required: [
    "nominalRange",
    "nominalDeltaRange",
    "deltaMeasurements",
    "interpolated",
    "setpoints",
  ],
  additionalProperties: false,
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
} as const satisfies JSONSchema;

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

export const outputSettingsScheduleSchema = {
  type: "array",
  items: {
    type: "object",
    required: ["time", "value"],
    additionalProperties: false,
    properties: {
      time: { type: "string", format: "time" },
      value: {},
    },
  },
  minItems: 1,
} as const satisfies JSONSchema;

export const continuousOutputSettingsSchema = {
  type: "object",
  title: "Continuous output settings",
  required: ["minimal", "maximal"],
  additionalProperties: false,
  properties: {
    minimal: {
      type: "number",
    },
    maximal: {
      type: "number",
    },
  },
} as const satisfies JSONSchema;

export const continuousOutputSettingsUiSchema = {
  minimal: {
    "ui:title": "Minimal command value",
  },
  maximal: {
    "ui:title": "Maximal command value",
  },
};

export const scheduledOutputSettingsSchema = {
  type: "object",
  title: "Scheduled output settings",
  required: ["interpolated", "schedules"],
  additionalProperties: false,
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
        additionalProperties: false,
        properties: {
          schedule: outputSettingsScheduleSchema,
        },
      },
      minItems: 1,
    },
  },
} as const satisfies JSONSchema;

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

export const outputSettingsSchema = {
  allOf: [
    {
      type: "object",
      required: ["type"],
      additionalProperties: false,
      properties: {
        type: { type: "string", enum: ["continuous", "scheduled"] },
      },
    },
    {
      oneOf: [
        {
          type: "object",
          required: ["continuous"],
          additionalProperties: false,
          properties: { continuous: continuousOutputSettingsSchema },
        },
        {
          type: "object",
          required: ["scheduled"],
          additionalProperties: false,
          properties: { scheduled: scheduledOutputSettingsSchema },
        },
      ],
    },
  ],
} as const satisfies JSONSchema;

export const fuzzyRuleCondition = {
  type: "object",
  required: [
    "negation",
    "hedge",
    "delta",
    "peripheral",
    "quantityType",
    "fuzzyVariable",
  ],
  additionalProperties: false,
  properties: {
    negation: { type: "boolean" },
    hedge: hedgeSchema,
    delta: { type: "boolean" },
    peripheral: { type: "string" },
    quantityType: { type: "number" },
    fuzzyVariable: inputFuzzySetSchema,
  },
} as const satisfies JSONSchema;

export const fuzzyRuleImplication = {
  type: "object",
  required: ["peripheral", "command", "fuzzyVariable"],
  additionalProperties: false,
  properties: {
    peripheral: { type: "string" },
    command: { type: "string" },
    fuzzyVariable: outputFuzzySetSchema,
  },
} as const satisfies JSONSchema;

export const fuzzyRuleSchedule = {
  type: "object",
  required: ["peripheral", "command", "schedule"],
  additionalProperties: false,
  properties: {
    peripheral: { type: "string" },
    command: { type: "string" },
    schedule: { type: "number", format: "int32" },
  },
} as const satisfies JSONSchema;

export const fuzzyRule = {
  type: "object",
  required: ["condition", "implication", "schedules", "activeFrom", "activeTo"],
  additionalProperties: false,
  properties: {
    condition: { type: "array", items: fuzzyRuleCondition },
    implication: { type: "array", items: fuzzyRuleImplication },
    schedules: { type: "array", items: fuzzyRuleSchedule },
    activeFrom: { type: "string", format: "time" },
    activeTo: { type: "string", format: "time" },
  },
} as const satisfies JSONSchema;

export const fuzzyControlSchema = {
  type: "object",
  required: ["input", "output", "rules"],
  additionalProperties: false,
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
} as const satisfies JSONSchema;

// Assert types and schema overlap neatly (not all differences can be caught
// this way, but common mistakes should cause an error during compilation):
const assert = <T1, T2 extends T1, _ extends T2>() => {};
type FuzzyControl_ = FromSchema<typeof fuzzyControlSchema>;
assert<FuzzyControl_, FuzzyControl, FuzzyControl_>();

const ajv = new Ajv();
addFormats(ajv);

const validateFuzzyControlInner = ajv.compile(fuzzyControlSchema);

export const validateFuzzyControl = (data: unknown): data is FuzzyControl => {
  return validateFuzzyControlInner(data);
};

/**
 * Returns the error that caused the previous call to validateFuzzyControl to
 * evaluate to false
 */
export const validateFuzzyControlErrors = () => {
  return validateFuzzyControlInner.errors ?? null;
};
