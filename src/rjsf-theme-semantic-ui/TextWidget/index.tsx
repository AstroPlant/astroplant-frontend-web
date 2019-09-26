import React from "react";

import { WidgetProps } from "react-jsonschema-form";
import { Input, InputProps } from "semantic-ui-react";

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
    const _onChange = (
      _: React.ChangeEvent<HTMLInputElement>,
      data: InputProps
    ) => onChange(value === "" ? options.emptyValue : data.value);
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
