import React from "react";
import { connect } from "react-redux";
import { Container, Card } from "semantic-ui-react";
import { RootState } from "types";
import { KitState } from "modules/kit/reducer";
import { PeripheralDefinition, QuantityType } from "astroplant-api";
import Option from "utils/option";

import RawMeasurementComp from "./RawMeasurement";

type Params = { kitSerial: string };

export type Props = {
  kitState: KitState;
  peripheralDefinitions: { [id: string]: PeripheralDefinition };
  quantityTypes: { [id: string]: QuantityType };
};

function RawMeasurements(props: Props) {
  const { kitState, peripheralDefinitions, quantityTypes } = props;
  const rawMeasurements = kitState.rawMeasurements;
  let activeConfiguration = null;
  for (const configuration of Object.values(kitState.configurations.unwrap())) {
    if (configuration.active) {
      activeConfiguration = configuration;
    }
  }

  if (activeConfiguration !== null) {
    let hasMeasurements = false;
    const cards = Object.values(activeConfiguration.peripherals).map(
      (peripheral) => {
        const def: Option<PeripheralDefinition> = Option.from(
          peripheralDefinitions[peripheral.peripheralDefinitionId]
        );
        return def
          .map((def: PeripheralDefinition) =>
            def.expectedQuantityTypes!.map((quantityType) => {
              hasMeasurements = true;
              const qt: Option<QuantityType> = Option.from(
                quantityTypes[quantityType]
              );
              return qt
                .map((qt) => {
                  const measurement = Option.from(
                    rawMeasurements[peripheral.id + "." + qt.id]
                  );
                  return (
                    <RawMeasurementComp
                      key={peripheral.id + "." + qt.id}
                      peripheral={peripheral}
                      peripheralDefinition={def}
                      quantityType={qt}
                      rawMeasurement={measurement}
                    />
                  );
                })
                .unwrapOrNull();
            })
          )
          .unwrapOrNull();
      }
    );
    if (hasMeasurements) {
      return (
        <Container>
          <Card.Group centered stackable itemsPerRow={4}>
            {cards}
          </Card.Group>
        </Container>
      );
    } else {
      return <Container>No measurements are being made on this configuration.</Container>;
    }
  } else {
    return null;
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    peripheralDefinitions: state.peripheralDefinition.definitions,
    quantityTypes: state.quantityType.quantityTypes,
  };
};

export default connect(mapStateToProps)(RawMeasurements);
