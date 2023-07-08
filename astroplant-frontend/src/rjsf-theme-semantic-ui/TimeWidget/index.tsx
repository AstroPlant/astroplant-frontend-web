import React from "react";
import { WidgetProps } from "@rjsf/utils";
import { Input } from "semantic-ui-react";

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
  return input;
}

export function TimeWidget(props: any) {
  return ({
    id,
    autofocus,
    disabled,
    readonly,
    value,
    onChange,
    onBlur,
    onFocus,
    options,
  }: WidgetProps) => {
    const _onChange = ({
      target: { value },
    }: React.ChangeEvent<HTMLInputElement>) => {
      onChange(value === "" ? options.emptyValue : value);
    };
    const _onBlur = ({
      target: { value },
    }: React.FocusEvent<HTMLInputElement>) => {
      const newValue = processInput(value);
      if (newValue !== value) {
        onChange(newValue);
      }
      onBlur(id, newValue);
    };
    const _onFocus = ({
      target: { value },
    }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

    return (
      <Input
        id={id}
        autoFocus={autofocus}
        disabled={disabled || readonly}
        name={id}
        value={value ? value : ""}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        type={"time"}
        step="1"
        {...props}
      />
    );
  };
}

export default TimeWidget({});
