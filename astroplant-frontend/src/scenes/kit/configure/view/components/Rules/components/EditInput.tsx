import React, { useState, useRef } from "react";
import compose from "~/utils/compose";
import { withTranslation, WithTranslation } from "react-i18next";
import { Modal, Header, Button, Icon } from "semantic-ui-react";
import validator from "@rjsf/validator-ajv8";

import RjsfForm from "~/rjsf-theme-semantic-ui";

import {
  InputSettings,
  inputSettingsSchema,
  inputSettingsUiSchema,
} from "../schemas";
import { schemas } from "~/api";

export type Props = {
  peripheral: schemas["Peripheral"];
  quantityType: schemas["QuantityType"];
  inputSettings: InputSettings;
  edit: (
    peripheral: schemas["Peripheral"],
    quantityType: schemas["QuantityType"],
    inputSettings: InputSettings
  ) => void;
  delete: (peripheral: schemas["Peripheral"], quantityType: schemas["QuantityType"]) => void;
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

  const handleDelete = (peripheral: schemas["Peripheral"], quantityType: schemas["QuantityType"]) => {
    props.delete(peripheral, quantityType);
    handleClose();
  };

  const handleSubmit = (
    peripheral: schemas["Peripheral"],
    quantityType: schemas["QuantityType"],
    inputSettings: InputSettings
  ) => {
    props.edit(peripheral, quantityType, inputSettings);
    handleClose();
  };

  return (
    <Modal
      closeOnEscape={true}
      closeOnDimmerClick={true}
      open={true}
      onClose={handleClose}
    >
      <Modal.Header>
        <Icon name="thermometer" /> {peripheral.name} —{" "}
        {quantityType.physicalQuantity} in {quantityType.physicalUnit}
      </Modal.Header>
      <Modal.Content scrolling>
        <Header size="small">Please choose the input settings.</Header>
        <RjsfForm
          schema={inputSettingsSchema}
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
      </Modal.Content>
      <Modal.Actions>
        <Button
          primary
          onClick={() => (submitButtonRef.current! as any).click()}
        >
          Submit
        </Button>
        <Button
          secondary
          onClick={() => handleDelete(peripheral, quantityType)}
        >
          Delete
        </Button>
        <Button color="red" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default compose<PInner, Props>(withTranslation())(EditPeripheral);
