import React from "react";

import { WidgetProps } from "react-jsonschema-form";
import { Input } from "semantic-ui-react";

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
    }: React.FocusEvent<HTMLInputElement>) => onBlur(id, value);
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
        {...props}
      />
    );
  };
}

export default TextWidget({});
