import { withTheme, ThemeProps } from "react-jsonschema-form";

import FieldTemplate from "./FieldTemplate";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import ErrorList from "./ErrorList";

import TitleField from "./TitleField";

import CheckboxWidget from "./CheckboxWidget";
import TextWidget from "./TextWidget";
import EmailWidget from "./EmailWidget";
import PasswordWidget from "./PasswordWidget";

export const Theme: ThemeProps = {
  className: "ui warning form",
  FieldTemplate,
  ObjectFieldTemplate,
  ErrorList,
  fields: {
    TitleField
  },
  widgets: {
    CheckboxWidget,
    TextWidget,
    EmailWidget,
    PasswordWidget
  }
};

export default withTheme(Theme);
