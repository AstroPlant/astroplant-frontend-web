import {
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
  TemplatesType,
} from "@rjsf/utils";
import { Icon } from "semantic-ui-react";
import { Button } from "~/Components/Button";

function buttonTemplates<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(): TemplatesType<T, S, F>["ButtonTemplates"] {
  return {
    SubmitButton: (props) => <Button {...props}>Submit</Button>,
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
