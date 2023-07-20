import { useCallback } from "react";
import {
  getTemplate,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  WidgetProps,
} from "@rjsf/utils";
import { countCharOccurrences } from "~/utils/string";

function processInput(input: string): string {
  // const dt = DateTime.fromFormat(input, "HH:mm");
  // const dt2 = DateTime.fromFormat(input, "HH:mm:ss");
  // console.warn(dt, dt.isValid, dt.invalidReason, dt.toLocaleString());
  // if (dt && dt.isValid) {
  //   return dt.toFormat("HH:mm:ss");
  // } else if (dt2 && dt2.isValid) {
  //   return dt2.toFormat("HH:mm:ss");
  // } else {
  //   return input;
  // }

  // Seconds are not always added by the browser, but are required by the schema.
  if (countCharOccurrences(":", input) === 1) {
    return `${input}:00`;
  } else {
    return input;
  }
}

export default function TimeWidget<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: WidgetProps<T, S, F>) {
  const { registry, onChange, onBlur, options } = props;

  const _onChange = useCallback(
    (value: any) => {
      onChange(value === "" ? options.emptyValue : value);
    },
    [onChange, options.emptyValue],
  );

  const _onBlur = useCallback(
    (id: string, value: any) => {
      const newValue = processInput(value);
      if (newValue !== value) {
        onChange(newValue);
      }
      onBlur(id, newValue);
    },
    [onChange, onBlur],
  );

  const BaseInputTemplate = getTemplate<"BaseInputTemplate", T, S, F>(
    "BaseInputTemplate",
    registry,
    options,
  );

  return (
    <BaseInputTemplate
      type="time"
      {...props}
      onChange={_onChange}
      onBlur={_onBlur}
    />
  );
}
