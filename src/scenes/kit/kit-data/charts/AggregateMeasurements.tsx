import { useSelector } from "react-redux";
import { Container, Card } from "semantic-ui-react";
import { KitState } from "~/modules/kit/reducer";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";
import { selectors as quantityTypesSelectors } from "~/modules/quantity-type/reducer";

import AggregateMeasurementsChart from "./AggregateMeasurementsChart";
import { useAppSelector } from "~/hooks";
import { schemas } from "~/api";

export type Props = {
  kitState: KitState;
  configuration: schemas["KitConfigurationWithPeripherals"];
};

export default function AggregateMeasurements({
  kitState,
  configuration,
}: Props) {
  const peripheralDefinitions = useSelector(
    peripheralDefinitionsSelectors.selectEntities,
  );
  const quantityTypes = useAppSelector(quantityTypesSelectors.selectEntities);

  let hasMeasurements = false;
  const cards = Object.values(configuration.peripherals).map((peripheral) => {
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
      <Container>No measurements are made on this configuration.</Container>
    );
  }
}
