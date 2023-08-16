import React from "react";
import compose from "~/utils/compose";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Modal, Card, Header, Icon } from "semantic-ui-react";
import { JSONSchema7 } from "json-schema";

import { RootState } from "~/types";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";
import { schemas } from "~/api";
import { Button } from "~/Components/Button";

export type Props = {
  choices: [schemas["Peripheral"], string, JSONSchema7][];
  add: (
    peripheral: schemas["Peripheral"],
    command: string,
    schema: JSONSchema7,
  ) => void;
};

type PInner = Props &
  WithTranslation & {
    peripheralDefinitions: { [id: string]: schemas["PeripheralDefinition"] };
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
    peripheral: schemas["Peripheral"],
    command: string,
    schema: JSONSchema7,
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
            variant="primary"
            disabled={choices.length === 0}
            leftAdornment={<Icon name="plus" />}
            onClick={() => this.handleOpen()}
          >
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
              const pDef =
                peripheralDefinitions[peripheral.peripheralDefinitionId]!;
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
          <Button variant="negative" onClick={() => this.handleClose()}>
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
  withTranslation(),
)(AddPeripheral);
