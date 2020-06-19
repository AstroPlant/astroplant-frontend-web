/* Based on
 * https://github.com/rjsf-team/react-jsonschema-form/blob/599a360bc51f9fbe9ab7efde4cf82fa3853b474c/packages/material-ui/src/ArrayFieldTemplate/ArrayFieldTemplate.tsx
 */

import React from "react";

import { utils } from "@rjsf/core";
import { ArrayFieldTemplateProps, IdSchema } from "@rjsf/core";

import { Segment, Divider, Button } from "semantic-ui-react";

import AddButton from "../AddButton";
import IconButton from "../IconButton";

const { isMultiSelect, getDefaultRegistry } = utils;

const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  const { schema, registry = getDefaultRegistry() } = props;

  if (isMultiSelect(schema, registry.definitions)) {
    return <DefaultFixedArrayFieldTemplate {...props} />;
  } else {
    return <DefaultNormalArrayFieldTemplate {...props} />;
  }
};

type ArrayFieldTitleProps = {
  TitleField: any;
  idSchema: IdSchema;
  title: string;
  required: boolean;
};

const ArrayFieldTitle = ({
  TitleField,
  idSchema,
  title,
  required,
}: ArrayFieldTitleProps) => {
  if (!title) {
    return <div />;
  }

  const id = `${idSchema.$id}__title`;
  return <TitleField id={id} title={title} required={required} />;
};

type ArrayFieldDescriptionProps = {
  DescriptionField: any;
  idSchema: IdSchema;
  description: string;
};

const ArrayFieldDescription = ({
  DescriptionField,
  idSchema,
  description,
}: ArrayFieldDescriptionProps) => {
  if (!description) {
    return <div />;
  }

  const id = `${idSchema.$id}__description`;
  return <DescriptionField id={id} description={description} />;
};

// Used in the two templates
const DefaultArrayItem = (props: any) => {
  const btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: "bold",
  };
  return (
    <div key={props.key}>
      <Segment raised attached="top">
        {props.children}
      </Segment>

      {props.hasToolbar && (
        <Button.Group attached="bottom">
          <IconButton
            icon="arrow-up"
            className="array-item-move-up"
            tabIndex={-1}
            style={btnStyle as any}
            fluid
            disabled={props.disabled || props.readonly || !props.hasMoveUp}
            onClick={props.onReorderClick(props.index, props.index - 1)}
          />

          <IconButton
            icon="arrow-down"
            tabIndex={-1}
            style={btnStyle as any}
            fluid
            disabled={props.disabled || props.readonly || !props.hasMoveDown}
            onClick={props.onReorderClick(props.index, props.index + 1)}
          />

          <IconButton
            icon="remove"
            tabIndex={-1}
            style={btnStyle as any}
            fluid
            disabled={props.disabled || props.readonly || !props.hasRemove}
            onClick={props.onDropIndexClick(props.index)}
          />
        </Button.Group>
      )}
      <Divider hidden />
    </div>
  );
};

const DefaultFixedArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  return (
    <fieldset className={props.className}>
      <ArrayFieldTitle
        key={`array-field-title-${props.idSchema.$id}`}
        TitleField={props.TitleField}
        idSchema={props.idSchema}
        title={props.uiSchema["ui:title"] || props.title}
        required={props.required}
      />

      {(props.uiSchema["ui:description"] || props.schema.description) && (
        <div
          className="field-description"
          key={`field-description-${props.idSchema.$id}`}
        >
          {props.uiSchema["ui:description"] || props.schema.description}
        </div>
      )}

      <div
        className="row array-item-list"
        key={`array-item-list-${props.idSchema.$id}`}
      >
        {props.items && props.items.map(DefaultArrayItem)}
      </div>

      {props.canAdd && (
        <AddButton
          className="array-item-add"
          onClick={props.onAddClick}
          disabled={props.disabled || props.readonly}
        />
      )}
    </fieldset>
  );
};

const DefaultNormalArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
  return (
    <Segment raised>
      <ArrayFieldTitle
        key={`array-field-title-${props.idSchema.$id}`}
        TitleField={props.TitleField}
        idSchema={props.idSchema}
        title={props.uiSchema["ui:title"] || props.title}
        required={props.required}
      />

      {(props.uiSchema["ui:description"] || props.schema.description) && (
        <ArrayFieldDescription
          key={`array-field-description-${props.idSchema.$id}`}
          DescriptionField={props.DescriptionField}
          idSchema={props.idSchema}
          description={
            props.uiSchema["ui:description"] || props.schema.description
          }
        />
      )}

      <div key={`array-item-list-${props.idSchema.$id}`}>
        {props.items && props.items.map((p) => DefaultArrayItem(p))}

        {props.canAdd && (
          <>
            <Divider />
            <AddButton
              className="array-item-add"
              onClick={props.onAddClick}
              disabled={props.disabled || props.readonly}
            />
          </>
        )}
      </div>
    </Segment>
  );
};

export default ArrayFieldTemplate;
