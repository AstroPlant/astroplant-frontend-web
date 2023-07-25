import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { Container, Card } from "semantic-ui-react";
import { KitState, peripheralSelectors } from "~/modules/kit/reducer";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";
import { selectors as quantityTypesSelectors } from "~/modules/quantity-type/reducer";

import AggregateMeasurementsChart from "./AggregateMeasurementsChart";
import { ConfigurationsContext } from "../../contexts";
import { useAppSelector } from "~/hooks";

export type Props = {
  kitState: KitState;
};

export default function AggregateMeasurements(props: Props) {
  const peripheralDefinitions = useSelector(
    peripheralDefinitionsSelectors.selectEntities,
  );
  const quantityTypes = useAppSelector(quantityTypesSelectors.selectEntities);
  const peripherals = useAppSelector(peripheralSelectors.selectEntities);

  const { kitState } = props;
  const configurations = useContext(ConfigurationsContext);
  let activeConfiguration =
    Object.values(configurations).find((conf) => conf.active) ?? null;

  if (activeConfiguration === null) {
    return null;
  }

  let hasMeasurements = false;
  const cards = Object.values(activeConfiguration.peripherals)
    .map((id) => peripherals[id]!)
    .map((peripheral) => {
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
    });

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
