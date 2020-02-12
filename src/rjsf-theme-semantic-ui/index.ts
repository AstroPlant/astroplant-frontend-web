import { withTheme, ThemeProps } from "react-jsonschema-form";

import FieldTemplate from "./FieldTemplate";
import ArrayFieldTemplate from "./ArrayFieldTemplate";
import ObjectFieldTemplate from "./ObjectFieldTemplate";
import ErrorList from "./ErrorList";

import TitleField from "./TitleField";

import CheckboxWidget from "./CheckboxWidget";
import TextWidget from "./TextWidget";
import EmailWidget from "./EmailWidget";
import TimeWidget from "./TimeWidget";
import PasswordWidget from "./PasswordWidget";
import CoordinateField from "./CoordinateField";

export const Theme: ThemeProps = {
  className: "ui warning form",
  FieldTemplate,
  ArrayFieldTemplate,
  ObjectFieldTemplate,
  ErrorList,
  fields: {
    TitleField,
    Coordinate: CoordinateField
  },
  widgets: {
    CheckboxWidget,
    TextWidget,
    EmailWidget,
    TimeWidget,
    PasswordWidget
  }
};

export default withTheme(Theme);
