import React from "react";
import { compose } from "recompose";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form, Modal, Header, Button, Icon } from "semantic-ui-react";
import produce from "immer";
import { JSONSchema7 } from "json-schema";
import RjsfForm from "rjsf-theme-semantic-ui";

import { Peripheral } from "astroplant-api";

import {
  OutputSettings,
  outputSettingsSchema,
  outputSettingsUiSchema,
} from "../schemas";

export type Props = {
  peripheral: Peripheral;
  command: string;
  schema: JSONSchema7;
  outputSettings: OutputSettings;
  edit: (
    peripheral: Peripheral,
    command: string,
    outputSettings: OutputSettings
  ) => void;
  delete: (peripheral: Peripheral, command: string) => void;
  close: () => void;
};

type PInner = Props & WithTranslation;

type State = {};

class EditPeripheral extends React.Component<PInner, State> {
  state: State = {};

  handleClose = () => {
    this.props.close();
  };

  handleDelete = (peripheral: Peripheral, command: string) => {
    this.props.delete(peripheral, command);
    this.handleClose();
  };

  handleSubmit = (
    peripheral: Peripheral,
    command: string,
    outputSettings: OutputSettings
  ) => {
    this.props.edit(peripheral, command, outputSettings);
    this.handleClose();
  };

  // edit(outputSettings: OutputSettings) {
  //   const { peripheral, command, edit, close } = this.props;
  //   edit(peripheral, quantityType, inputSettings);
  //   close();
  // }

  render() {
    const { peripheral, command, schema, outputSettings } = this.props;

    const outputSettingsSchemaModified = produce(
      outputSettingsSchema,
      (draft) => {
        // @ts-ignore
        draft.properties.continuous.properties.minimal = schema;
        // @ts-ignore
        draft.properties.continuous.properties.maximal = schema;
      }
    );

    return (
      <Modal
        closeOnEscape={true}
        closeOnDimmerClick={true}
        open={true}
        onClose={this.handleClose}
      >
        <Modal.Header>
          <Icon name="cogs" /> {peripheral.name} — {command}
        </Modal.Header>
        <Modal.Content>
          <Header size="small">Please choose the output settings.</Header>
          <RjsfForm
            schema={outputSettingsSchemaModified}
            uiSchema={outputSettingsUiSchema}
            onSubmit={({ formData }) =>
              this.handleSubmit(peripheral, command, formData)
            }
            formData={outputSettings}
          >
            <Form.Button type="submit" primary>
              Update
            </Form.Button>
          </RjsfForm>
        </Modal.Content>
        <Modal.Actions>
          <Button
            secondary
            onClick={() => this.handleDelete(peripheral, command)}
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
