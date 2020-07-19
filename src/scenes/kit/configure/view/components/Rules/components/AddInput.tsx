import React from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Modal, Card, Header, Button, Icon } from "semantic-ui-react";

import { RootState } from "types";
import { PeripheralDefinition, Peripheral, QuantityType } from "astroplant-api";
import { selectors as peripheralDefinitionsSelectors } from "modules/peripheral-definition/reducer";

export type Props = {
  choices: [Peripheral, QuantityType][];
  add: (peripheral: Peripheral, quantityType: QuantityType) => void;
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

  selectPeripheralQuantityType(
    peripheral: Peripheral,
    quantityType: QuantityType
  ) {
    this.props.add(peripheral, quantityType);
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
            Add input
          </Button>
        }
        closeOnEscape={true}
        closeOnDimmerClick={true}
        open={this.state.open}
        onClose={this.handleClose}
      >
        <Modal.Header>
          <Icon name="thermometer" /> Add fuzzy input
        </Modal.Header>
        <Modal.Content>
          <Header size="small">
            Please select the peripheral and quantity type to add as input.
          </Header>
          <Card.Group centered stackable columns={3}>
            {choices.map(([peripheral, quantityType]) => {
              const pDef = peripheralDefinitions[
                peripheral.peripheralDefinitionId
              ]!;
              return (
                <Card
                  key={`${peripheral.name}-${quantityType.id}`}
                  onClick={() =>
                    this.selectPeripheralQuantityType(peripheral, quantityType)
                  }
                  color="yellow"
                >
                  <Card.Content>
                    <Card.Header>
                      {quantityType.physicalQuantity} in{" "}
                      {quantityType.physicalUnit}{" "}
                      {quantityType.physicalUnitSymbol &&
                        `(${quantityType.physicalUnitSymbol})`}
                    </Card.Header>
                    <Card.Description>
                      Measured by: {peripheral.name}
                    </Card.Description>
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
