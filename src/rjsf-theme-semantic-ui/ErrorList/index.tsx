import React from "react";

import { ErrorListProps } from "react-jsonschema-form";
import { Message } from "semantic-ui-react";

export default function ErrorList(props: ErrorListProps) {
  const { errors } = props;
  return (
    <Message
      warning
      header="Errors"
      list={errors.map((err: any) => err.stack)}
    />
  );
}
