import React from "react";

import { FieldProps } from "@rjsf/core";
import { Header } from "semantic-ui-react";

export default function TitleField({ title }: FieldProps) {
  return <Header>{title}</Header>;
}
