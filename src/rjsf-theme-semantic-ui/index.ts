import { withTheme, ThemeProps, utils } from "@rjsf/core";

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

const { getDefaultRegistry } = utils;

const { fields, widgets } = getDefaultRegistry();

export const Theme: ThemeProps = {
  className: "ui warning form",
  ArrayFieldTemplate,
  fields: { ...fields, TitleField, CoordinateField },
  FieldTemplate,
  ObjectFieldTemplate,
  widgets: {
    ...widgets,
    CheckboxWidget,
    TextWidget,
    EmailWidget,
    PasswordWidget,
    time: TimeWidget,
  },
  ErrorList,
};

export default withTheme(Theme);
