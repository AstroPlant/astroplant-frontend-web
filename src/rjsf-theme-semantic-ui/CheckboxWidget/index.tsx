import React from "react";

import { WidgetProps } from "@rjsf/core";
import { Checkbox, CheckboxProps } from "semantic-ui-react";

export default function TextWidget({
  id,
  label,
  autofocus,
  disabled,
  readonly,
  value,
  onChange,
  onBlur,
  onFocus,
  options
}: WidgetProps) {
  const _onChange = (
    _: React.SyntheticEvent<HTMLInputElement>,
    data: CheckboxProps
  ) => onChange(data.checked);
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);
  const _onFocus = ({
    target: { value }
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

  return (
    <Checkbox
      id={id}
      name={id}
      label={label}
      autoFocus={autofocus}
      disabled={disabled || readonly}
      checked={typeof value === "undefined" ? false : value}
      onChange={_onChange}
      onBlur={_onBlur}
      onFocus={_onFocus}
    />
  );
}
