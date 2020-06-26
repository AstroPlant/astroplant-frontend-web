import React from "react";

import { FieldTemplateProps } from "@rjsf/core";
import { Form, Label, List } from "semantic-ui-react";

export default function FieldTemplate(props: FieldTemplateProps) {
  const {
    id,
    label,
    displayLabel,
    help,
    required,
    description,
    rawErrors = [],
    children,
    schema,
  } = props;
  return (
    <Form.Field>
      {displayLabel && label && (
        <label htmlFor={id}>
          {label}
          {required ? "*" : null}
        </label>
      )}
      {schema["type"] !== "array" && description}
      {children}
      {rawErrors.length > 0 && (
        <div style={{ width: "100%" }}>
          <Label pointing prompt>
            <List>
              {rawErrors.map((rawError, index: number) => (
                <List.Item key={index} content={rawError} />
              ))}
            </List>
          </Label>
        </div>
      )}
      {help}
    </Form.Field>
  );
}
