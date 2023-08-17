import React from "react";
import compose from "~/utils/compose";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Modal, Card, Header } from "semantic-ui-react";
import { IconPlus, IconTransferIn } from "@tabler/icons-react";

import { RootState } from "~/types";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";
import { schemas } from "~/api";
import { Button } from "~/Components/Button";

export type Props = {
  choices: [schemas["Peripheral"], schemas["QuantityType"]][];
  add: (
    peripheral: schemas["Peripheral"],
    quantityType: schemas["QuantityType"],
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

  selectPeripheralQuantityType(
    peripheral: schemas["Peripheral"],
    quantityType: schemas["QuantityType"],
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
            variant="primary"
            disabled={choices.length === 0}
            leftAdornment={<IconPlus aria-hidden />}
            onClick={() => this.handleOpen()}
          >
            Add input
          </Button>
        }
        closeOnEscape={true}
        closeOnDimmerClick={true}
        open={this.state.open}
        onClose={this.handleClose}
      >
        <Modal.Header>
          <span className="flex items-center gap-1">
            <IconTransferIn aria-hidden /> Add fuzzy input
          </span>
        </Modal.Header>
        <Modal.Content>
          <Header size="small">
            Please select the peripheral and quantity type to add as input.
          </Header>
          <Card.Group centered stackable columns={3}>
            {choices.map(([peripheral, quantityType]) => {
              const pDef =
                peripheralDefinitions[peripheral.peripheralDefinitionId]!;
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
