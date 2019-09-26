import React from "react";

import { ObjectFieldTemplateProps } from "react-jsonschema-form";
import { Segment } from "semantic-ui-react";

export default function ObjectFieldTemplate(props: ObjectFieldTemplateProps) {
  const {
    DescriptionField,
    description,
    TitleField,
    title,
    properties,
    required,
    idSchema
  } = props;

  return (
    <>
      {(title !== null || description != null) && (
        <Segment vertical>
          {title !== null && (
            <TitleField
              id={`${idSchema.$id}-title`}
              title={title}
              required={required}
            />
          )}
          {description && (
            <DescriptionField
              id={`${idSchema.$id}-description`}
              description={description}
            />
          )}
        </Segment>
      )}
      <Segment vertical>
        {properties.map((element: any) => element.content)}
      </Segment>
    </>
  );
}
