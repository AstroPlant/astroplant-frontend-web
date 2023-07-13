import React, { useContext } from "react";
import { Container, Card } from "semantic-ui-react";
import { KitState, peripheralSelectors } from "~/modules/kit/reducer";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";
import { selectors as quantityTypesSelectors } from "~/modules/quantity-type/reducer";
import Option from "~/utils/option";

import RawMeasurementComp from "./RawMeasurement";
import { schemas } from "~/api";
import { ConfigurationsContext } from "../../contexts";
import { useAppSelector } from "~/hooks";

export type Props = {
  kitState: KitState;
};

export default function RawMeasurements(props: Props) {
  const peripheralDefinitions = useAppSelector(
    peripheralDefinitionsSelectors.selectEntities
  );
  const quantityTypes = useAppSelector(quantityTypesSelectors.selectEntities);
  const peripherals = useAppSelector(peripheralSelectors.selectEntities);

  const { kitState } = props;
  const rawMeasurements = kitState.rawMeasurements;
  const configurations = useContext(ConfigurationsContext);
  let activeConfiguration =
    Object.values(configurations).find((conf) => conf.active) ?? null;

  if (activeConfiguration !== null) {
    let hasMeasurements = false;
    const cards = Object.values(activeConfiguration.peripherals)
      .map((id) => peripherals[id]!)
      .map((peripheral) => {
        const def: Option<schemas["PeripheralDefinition"]> = Option.from(
          peripheralDefinitions[peripheral.peripheralDefinitionId]
        );
        return def
          .map((def: schemas["PeripheralDefinition"]) =>
            def.expectedQuantityTypes!.map((quantityType) => {
              hasMeasurements = true;
              const qt: Option<schemas["QuantityType"]> = Option.from(
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
      });
    if (hasMeasurements) {
      return (
        <Container>
          <Card.Group centered stackable itemsPerRow={4}>
            {cards}
          </Card.Group>
        </Container>
      );
    } else {
      return (
        <Container>
          No measurements are being made on this configuration.
        </Container>
      );
    }
  } else {
    return null;
  }
}
