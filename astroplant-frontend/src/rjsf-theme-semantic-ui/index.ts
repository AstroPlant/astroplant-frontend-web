import produce from "immer";
import { withTheme, ThemeProps } from "@rjsf/core";
// @ts-ignore
import { Theme as SemanticUITheme } from "@rjsf/semantic-ui";

import TimeWidget from "./TimeWidget";
import CoordinateField from "./CoordinateField";

const Theme = produce(SemanticUITheme, (draft) => {
  draft.widgets["time"] = TimeWidget;
  draft.fields = {};
  draft.fields["CoordinateField"] = CoordinateField;
});

const Form = withTheme(Theme as ThemeProps);
export default Form;
