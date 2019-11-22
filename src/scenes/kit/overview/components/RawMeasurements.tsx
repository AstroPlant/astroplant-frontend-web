import React from "react";
import { connect } from "react-redux";
import { Container, Card } from "semantic-ui-react";
import { RootState } from "types";
import { KitState, RawMeasurement } from "modules/kit/reducer";
import { PeripheralDefinition, QuantityType } from "astroplant-api";
import Option from "utils/option";

import RawMeasurementComp from "./RawMeasurement";

type Params = { kitSerial: string };

export type Props = {
  kit: KitState;
  peripheralDefinitions: { [id: string]: PeripheralDefinition };
  quantityTypes: { [id: string]: QuantityType };
};

function RawMeasurements(props: Props) {
  const { kit, peripheralDefinitions, quantityTypes } = props;
  const rawMeasurements = kit.rawMeasurements;
  let activeConfiguration = null;
  for (const configuration of Object.values(kit.configurations)) {
    if (configuration.active) {
      activeConfiguration = configuration;
    }
  }

  if (activeConfiguration !== null) {
    return (
      <Container>
        <Card.Group centered>
          {Object.values(activeConfiguration.peripherals).map(peripheral => {
            const def: Option<PeripheralDefinition> = Option.from(
              peripheralDefinitions[peripheral.peripheralDefinitionId]
            );
            return def
              .map((def: PeripheralDefinition) =>
                def.expectedQuantityTypes!.map(quantityType => {
                  const qt: Option<QuantityType> = Option.from(
                    quantityTypes[quantityType]
                  );
                  return qt
                    .map(qt => {
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
          })}
        </Card.Group>
      </Container>
    );
  } else {
    return null;
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    peripheralDefinitions: state.peripheralDefinition.definitions,
    quantityTypes: state.quantityType.quantityTypes
  };
};

export default connect(mapStateToProps)(RawMeasurements);