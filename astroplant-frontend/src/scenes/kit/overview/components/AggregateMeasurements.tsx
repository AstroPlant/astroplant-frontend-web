import React from "react";
import { useSelector } from "react-redux";
import { Container, Card } from "semantic-ui-react";
import { KitConfigurationState, KitState } from "~/modules/kit/reducer";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";
import { selectors as quantityTypesSelectors } from "~/modules/quantity-type/reducer";

import AggregateMeasurementsChart from "./AggregateMeasurementsChart";

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
  if (activeConfiguration === null) {
    return null;
  }

  let hasMeasurements = false;
  const cards = Object.values(activeConfiguration.peripherals).map(
    (peripheral) => {
      const def = peripheralDefinitions[peripheral.peripheralDefinitionId];
      return (
        def !== undefined &&
        (def.expectedQuantityTypes ?? []).map((quantityType) => {
          hasMeasurements = true;
          const qt = quantityTypes[quantityType];
          return (
            qt !== undefined && (
              <AggregateMeasurementsChart
                key={peripheral.id + "." + qt.id}
                kitState={kitState}
                peripheral={peripheral}
                peripheralDefinition={def}
                quantityType={qt}
              />
            )
          );
        })
      );
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
}
