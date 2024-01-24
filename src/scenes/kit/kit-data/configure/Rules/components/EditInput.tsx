import React, { useState, useRef } from "react";
import compose from "~/utils/compose";
import { withTranslation, WithTranslation } from "react-i18next";
import { Icon } from "semantic-ui-react";
import validator from "@rjsf/validator-ajv8";
import { JSONSchema7 } from "json-schema";

import RjsfForm from "~/rjsf-theme";

import { InputSettings } from "~/control/types";
import { inputSettingsSchema, inputSettingsUiSchema } from "~/control/schemas";
import { schemas } from "~/api";
import { Button } from "~/Components/Button";
import { ModalDialog } from "~/Components/ModalDialog";

export type Props = {
  peripheral: schemas["Peripheral"];
  quantityType: schemas["QuantityType"];
  inputSettings: InputSettings;
  edit: (
    peripheral: schemas["Peripheral"],
    quantityType: schemas["QuantityType"],
    inputSettings: InputSettings,
  ) => void;
  delete: (
    peripheral: schemas["Peripheral"],
    quantityType: schemas["QuantityType"],
  ) => void;
  close: () => void;
};

type PInner = Props & WithTranslation;

function EditPeripheral(props: PInner) {
  const { peripheral, quantityType, inputSettings } = props;
  const [formData, setFormData] = useState(inputSettings);

  const submitButtonRef = useRef(null);

  const handleClose = () => {
    props.close();
  };

  const handleDelete = (
    peripheral: schemas["Peripheral"],
    quantityType: schemas["QuantityType"],
  ) => {
    props.delete(peripheral, quantityType);
    handleClose();
  };

  const handleSubmit = (
    peripheral: schemas["Peripheral"],
    quantityType: schemas["QuantityType"],
    inputSettings: InputSettings,
  ) => {
    props.edit(peripheral, quantityType, inputSettings);
    handleClose();
  };

  return (
    <ModalDialog
      open={true}
      onClose={handleClose}
      header={
        <>
          <Icon name="thermometer" /> {peripheral.name} —{" "}
          {quantityType.physicalQuantity} in {quantityType.physicalUnit}
        </>
      }
      actions={
        <>
          <Button variant="muted" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="negative"
            onClick={() => handleDelete(peripheral, quantityType)}
          >
            Delete
          </Button>
          <Button
            variant="primary"
            onClick={() => (submitButtonRef.current! as any).click()}
          >
            Submit
          </Button>
        </>
      }
    >
      <h3>Please choose the input settings.</h3>
      <RjsfForm
        schema={inputSettingsSchema as unknown as JSONSchema7}
        uiSchema={inputSettingsUiSchema}
        onSubmit={({ formData }) =>
          handleSubmit(peripheral, quantityType, formData)
        }
        onChange={({ formData }) => setFormData(formData)}
        formData={formData}
        validator={validator}
      >
        <input
          ref={submitButtonRef}
          type="submit"
          style={{ display: "none" }}
        />
      </RjsfForm>
    </ModalDialog>
  );
}

export default compose<PInner, Props>(withTranslation())(EditPeripheral);
