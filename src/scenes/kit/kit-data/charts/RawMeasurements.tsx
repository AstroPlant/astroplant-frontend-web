import { Container, Card } from "semantic-ui-react";
import {
  KitConfigurationState,
  KitState,
  peripheralSelectors,
} from "~/modules/kit/reducer";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";
import { selectors as quantityTypesSelectors } from "~/modules/quantity-type/reducer";
import Option from "~/utils/option";

import RawMeasurementComp from "./RawMeasurement";
import { schemas } from "~/api";
import { useAppSelector } from "~/hooks";

export type Props = {
  kitState: KitState;
  configuration: KitConfigurationState;
};

export default function RawMeasurements({ kitState, configuration }: Props) {
  const peripheralDefinitions = useAppSelector(
    peripheralDefinitionsSelectors.selectEntities,
  );
  const quantityTypes = useAppSelector(quantityTypesSelectors.selectEntities);
  const peripherals = useAppSelector(peripheralSelectors.selectEntities);

  const rawMeasurements = kitState.rawMeasurements;

  if (configuration !== null) {
    let hasMeasurements = false;
    const cards = Object.values(configuration.peripherals)
      .map((id) => peripherals[id]!)
      .map((peripheral) => {
        const def: Option<schemas["PeripheralDefinition"]> = Option.from(
          peripheralDefinitions[peripheral.peripheralDefinitionId],
        );
        return def
          .map((def: schemas["PeripheralDefinition"]) =>
            def.expectedQuantityTypes!.map((quantityType) => {
              hasMeasurements = true;
              const qt: Option<schemas["QuantityType"]> = Option.from(
                quantityTypes[quantityType],
              );
              return qt
                .map((qt) => {
                  const measurement = Option.from(
                    rawMeasurements[peripheral.id + "." + qt.id],
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
            }),
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
        <Container>No measurements are made on this configuration.</Container>
      );
    }
  } else {
    return null;
  }
}
