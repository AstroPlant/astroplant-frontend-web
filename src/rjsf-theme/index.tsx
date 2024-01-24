import { withTheme, ThemeProps } from "@rjsf/core";

// We make use of RJSF's core templates as much as possible, rather than
// maintaining our own set. Those templates use Bootstrap, but we don't bundle
// Bootstrap. We apply some presentational styling on the HTML tags / CSS
// classes output by RJSF. It's possible for this to go out of sync when RJSF
// updates, but hopefully this does not happen frequently. We can always
// implement our own template set if necessary.
import "./rjsf.css";

import TimeWidget from "./widgets/TimeWidget";
import CoordinateField from "./CoordinateField";
import buttonTemplates from "./templates/ButtonTemplates";
import BaseInputTemplate from "./templates/BaseInputTemplate";
import SelectWidget from "./widgets/SelectWidget";
import TextareaWidget from "./widgets/TextareaWidget";

const theme: ThemeProps = {
  fields: {
    CoordinateField: CoordinateField,
  },
  widgets: {
    TextareaWidget: TextareaWidget,
    TimeWidget: TimeWidget,
    SelectWidget: SelectWidget,
  },
  templates: {
    BaseInputTemplate: BaseInputTemplate,
    ButtonTemplates: buttonTemplates(),
  },
};

const Form = withTheme(theme);
export default Form;
