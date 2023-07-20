import produce from "immer";
import { withTheme, ThemeProps } from "@rjsf/core";
// @ts-ignore
import { Theme as SemanticUITheme } from "@rjsf/semantic-ui";

import TimeWidget from "./widgets/TimeWidget";
import CoordinateField from "./CoordinateField";

const Theme = produce(SemanticUITheme, (draft) => {
  draft.widgets = draft.widgets || {};
  draft.fields = draft.fields || {};

  draft.widgets["time"] = TimeWidget;
  draft.fields["CoordinateField"] = CoordinateField;
});

const Form = withTheme(Theme as ThemeProps);
export default Form;
