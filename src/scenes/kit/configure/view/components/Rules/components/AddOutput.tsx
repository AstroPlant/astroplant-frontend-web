import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Modal, Card, Header, Button, Icon } from "semantic-ui-react";
import { JSONSchema7 } from "json-schema";

import { RootState } from "types";
import { PeripheralDefinition, Peripheral } from "astroplant-api";
import { selectors as peripheralDefinitionsSelectors } from "modules/peripheral-definition/reducer";

export type Props = {
  choices: [Peripheral, string, JSONSchema7][];
  add: (peripheral: Peripheral, command: string, schema: JSONSchema7) => void;
};

type PInner = Props &
  WithTranslation & {
    peripheralDefinitions: { [id: string]: PeripheralDefinition };
  };

type State = {
  open: boolean;
};

class AddPeripheral extends React.Component<PInner, State> {
  state: State = {
    open: false,
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  selectPeripheralCommand(
    peripheral: Peripheral,
    command: string,
    schema: JSONSchema7
  ) {
    this.props.add(peripheral, command, schema);
    this.handleClose();
  }

  render() {
    const { choices, peripheralDefinitions } = this.props;

    return (
      <Modal
        trigger={
          <Button
            primary
            icon
            labelPosition="left"
            disabled={choices.length === 0}
            onClick={() => this.handleOpen()}
          >
            <Icon name="plus" />
            Add output
          </Button>
        }
        closeOnEscape={true}
        closeOnDimmerClick={true}
        open={this.state.open}
        onClose={this.handleClose}
      >
        <Modal.Header>
          <Icon name="thermometer" /> Add fuzzy output
        </Modal.Header>
        <Modal.Content>
          <Header size="small">
            Please select the peripheral and the command to add as output.
          </Header>
          <Card.Group centered stackable columns={3}>
            {choices.map(([peripheral, command, schema]) => {
              const pDef = peripheralDefinitions[
                peripheral.peripheralDefinitionId
              ]!;
              return (
                <Card
                  key={`${peripheral.name}-${command}`}
                  onClick={() =>
                    this.selectPeripheralCommand(peripheral, command, schema)
                  }
                  color="yellow"
                >
                  <Card.Content>
                    <Card.Header>{command}</Card.Header>
                    <Card.Description>On: {peripheral.name}</Card.Description>
                    <Card.Meta>
                      {pDef.brand} - {pDef.model}
                    </Card.Meta>
                  </Card.Content>
                </Card>
              );
            })}
          </Card.Group>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={this.handleClose}>
            Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    peripheralDefinitions: peripheralDefinitionsSelectors.selectEntities(state),
  };
};

export default compose<PInner, Props>(
  connect(mapStateToProps),
  withTranslation()
)(AddPeripheral);
