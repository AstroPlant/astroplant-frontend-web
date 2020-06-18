import React from "react";
import { compose } from "recompose";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Modal, Header, Button, Icon } from "semantic-ui-react";
import RjsfForm from "rjsf-theme-semantic-ui";

import { Peripheral, QuantityType } from "astroplant-api";

import {
  InputSettings,
  inputSettingsSchema,
  inputSettingsUiSchema,
} from "../schemas";

export type Props = {
  peripheral: Peripheral;
  quantityType: QuantityType;
  inputSettings: InputSettings;
  edit: (
    peripheral: Peripheral,
    quantityType: QuantityType,
    inputSettings: InputSettings
  ) => void;
  delete: (peripheral: Peripheral, quantityType: QuantityType) => void;
  close: () => void;
};

type PInner = Props & WithTranslation;

type State = {};

class EditPeripheral extends React.Component<PInner, State> {
  state: State = {};

  handleClose = () => {
    this.props.close();
  };

  handleDelete = (peripheral: Peripheral, quantityType: QuantityType) => {
    this.props.delete(peripheral, quantityType);
    this.handleClose();
  };

  handleSubmit = (
    peripheral: Peripheral,
    quantityType: QuantityType,
    inputSettings: InputSettings
  ) => {
    this.props.edit(peripheral, quantityType, inputSettings);
    this.handleClose();
  };

  edit(inputSettings: InputSettings) {
    const { peripheral, quantityType, edit, close } = this.props;
    edit(peripheral, quantityType, inputSettings);
    close();
  }

  render() {
    const { peripheral, quantityType, inputSettings } = this.props;

    return (
      <Modal
        closeOnEscape={true}
        closeOnDimmerClick={true}
        open={true}
        onClose={this.handleClose}
      >
        <Modal.Header>
          <Icon name="thermometer" /> {peripheral.name} —{" "}
          {quantityType.physicalQuantity} in {quantityType.physicalUnit}
        </Modal.Header>
        <Modal.Content>
          <Header size="small">Please choose the input settings.</Header>
          <RjsfForm
            schema={inputSettingsSchema}
            uiSchema={inputSettingsUiSchema}
            onSubmit={({ formData }) =>
              this.handleSubmit(peripheral, quantityType, formData)
            }
            formData={inputSettings}
          >
            <Form.Button type="submit" primary>
              Update
            </Form.Button>
          </RjsfForm>
        </Modal.Content>
        <Modal.Actions>
          <Button
            secondary
            onClick={() => this.handleDelete(peripheral, quantityType)}
          >
            Delete
          </Button>
          <Button color="red" onClick={this.handleClose}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default compose<PInner, Props>(withTranslation())(EditPeripheral);
