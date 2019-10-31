import React from "react";
import { Card, CardProps, Statistic, Loader } from "semantic-ui-react";
import { KitState, RawMeasurement } from "modules/kit/reducer";
import { Peripheral, PeripheralDefinition, QuantityType } from "astroplant-api";
import Option from "utils/option";

export type Props = CardProps & {
  peripheral: Peripheral;
  peripheralDefinition: PeripheralDefinition;
  quantityType: QuantityType;
  rawMeasurement: Option<RawMeasurement>;
};

export default (props: Props) => {
  const {
    peripheral,
    peripheralDefinition,
    quantityType,
    rawMeasurement,
    ...rest
  } = props;
  return (
    <Card color="blue" {...rest}>
      <Card.Content>
        <Card.Header>{quantityType.physicalQuantity}</Card.Header>
        <Card.Description textAlign='center'>
          <Statistic>
            <Statistic.Value>
              {rawMeasurement
                .map(m => <span>{Math.round(m.value * 100) / 100}</span>)
                .unwrapOr(<Loader active inline='centered' />)}
            </Statistic.Value>
            <Statistic.Label>
              {quantityType.physicalUnitSymbol || quantityType.physicalUnit}
            </Statistic.Label>
          </Statistic>
        </Card.Description>
        <Card.Meta>Measured by {peripheral.name}</Card.Meta>
      </Card.Content>
    </Card>
  );
};
