import React from "react";
import moment from "moment";
import { WidgetProps } from "@rjsf/core";
import { Input } from "semantic-ui-react";

function processInput(input: string): string {
  const m = moment(input, [
    moment.HTML5_FMT.TIME,
    moment.HTML5_FMT.TIME_SECONDS
  ]);
  if (m && m.isValid()) {
    return m.format("HH:mm:ss");
  } else {
    return input;
  }
}

export function TextWidget(props: any) {
  return ({
    id,
    autofocus,
    disabled,
    readonly,
    value,
    onChange,
    onBlur,
    onFocus,
    options
  }: WidgetProps) => {
    const _onChange = ({
      target: { value }
    }: React.ChangeEvent<HTMLInputElement>) => {
      onChange(value === "" ? options.emptyValue : value);
    };
    const _onBlur = ({
      target: { value }
    }: React.FocusEvent<HTMLInputElement>) => {
      const newValue = processInput(value);
      if (newValue !== value) {
        onChange(newValue);
      }
      onBlur(id, newValue);
    };
    const _onFocus = ({
      target: { value }
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

export default TextWidget({});
