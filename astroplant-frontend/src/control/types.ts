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
