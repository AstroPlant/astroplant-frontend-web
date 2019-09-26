import React from "react";

import { FieldProps } from "react-jsonschema-form";
import { Header } from "semantic-ui-react";

export default function TitleField({ title }: FieldProps) {
  return <Header>{title}</Header>;
}
