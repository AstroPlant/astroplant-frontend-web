import {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TemplatesType,
  getSubmitButtonOptions,
} from "@rjsf/utils";
import { Icon } from "semantic-ui-react";
import { Button } from "~/Components/Button";

function buttonTemplates<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): TemplatesType<T, S, F>["ButtonTemplates"] {
  return {
    SubmitButton: (props) => {
      const {
        submitText,
        norender,
        props: submitButtonProps,
      } = getSubmitButtonOptions<T, S, F>(props.uiSchema);
      if (norender) {
        return null;
      }
      return (
        <Button variant="primary" type="submit" {...submitButtonProps}>
          {submitText}
        </Button>
      );
    },
    AddButton: ({ uiSchema: _, ...props }) => (
      /* a bit hacky to specify the style here */
      <Button
        {...props}
        size="small"
        variant="muted"
        style={{ float: "right", marginRight: "1.2rem" }}
      >
        <Icon name="add" />
      </Button>
    ),
    CopyButton: ({ uiSchema: _, ...props }) => (
      <Button {...props} leftAdornment="+">
        Add
      </Button>
    ),
    MoveDownButton: ({ uiSchema: _, ...props }) => (
      <Button {...props} size="small" variant="muted">
        <Icon name="arrow down" />
      </Button>
    ),
    MoveUpButton: ({ uiSchema: _, ...props }) => (
      <Button {...props} size="small" variant="muted">
        <Icon name="arrow up" />
      </Button>
    ),
    RemoveButton: ({ uiSchema: _, ...props }) => (
      <Button {...props} size="small" variant="muted">
        <Icon name="delete" />
      </Button>
    ),
  };
}

export default buttonTemplates;
