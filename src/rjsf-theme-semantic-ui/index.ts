import produce from "immer";
import { withTheme, ThemeProps } from "@rjsf/core";
// @ts-ignore
import { Theme as SemanticUITheme } from "@rjsf/semantic-ui";

import TimeWidget from "./TimeWidget";
import CoordinateField from "./CoordinateField";

const Theme = produce(SemanticUITheme, (draft: any) => {
  draft.fields["CoordinateField"] = CoordinateField;
  draft.widgets["time"] = TimeWidget;
});

const Form = withTheme(Theme as ThemeProps);
export default Form;
