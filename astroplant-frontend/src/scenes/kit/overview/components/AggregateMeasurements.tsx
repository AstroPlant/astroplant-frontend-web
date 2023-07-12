import React from "react";
import { useSelector } from "react-redux";
import { Container, Card } from "semantic-ui-react";
import Option from "~/utils/option";
import { KitConfigurationState, KitState } from "~/modules/kit/reducer";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";
import { selectors as quantityTypesSelectors } from "~/modules/quantity-type/reducer";

import AggregateMeasurementsChart from "./AggregateMeasurementsChart";
import { schemas } from "~/api";

export type Props = {
  kitState: KitState;
};

export default function AggregateMeasurements(props: Props) {
  const peripheralDefinitions = useSelector(
    peripheralDefinitionsSelectors.selectEntities
  );
  const quantityTypes = useSelector(quantityTypesSelectors.selectEntities);

  const { kitState } = props;
  let activeConfiguration: null | KitConfigurationState = null;
  for (const configuration of Object.values(kitState.configurations!)) {
    if (configuration.active) {
      activeConfiguration = configuration;
    }
  }

  if (activeConfiguration !== null) {
    let hasMeasurements = false;
    const cards = Object.values(activeConfiguration.peripherals).map(
      (peripheral) => {
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
                  return (
                    <AggregateMeasurementsChart
                      key={peripheral.id + "." + qt.id}
                      kitState={kitState}
                      peripheral={peripheral}
                      peripheralDefinition={def}
                      quantityType={qt}
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
          <Card.Group centered>{cards}</Card.Group>
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
