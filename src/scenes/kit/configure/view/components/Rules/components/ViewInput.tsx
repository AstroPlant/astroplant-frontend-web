import React from "react";
import { Header, Table } from "semantic-ui-react";

import { Peripheral, QuantityType } from "astroplant-api";

import { InputSettings } from "../schemas";

export type Props = {
  peripheral: Peripheral;
  quantityType: QuantityType;
  inputSettings: InputSettings;
};

export default (props: Props) => {
  const { quantityType, inputSettings: settings } = props;
  return (
    <>
      <div>
        <strong>
          {quantityType.physicalQuantity} in {quantityType.physicalUnit}
          {quantityType.physicalUnitSymbol &&
            ` (${quantityType.physicalUnitSymbol})`}
        </strong>
      </div>
      <Table compact="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              Nominal range (
              {quantityType.physicalUnitSymbol || quantityType.physicalUnit})
            </Table.HeaderCell>
            <Table.HeaderCell>
              Nominal delta range (Δ
              {quantityType.physicalUnitSymbol || quantityType.physicalUnit})
            </Table.HeaderCell>
            <Table.HeaderCell>Number of delta measurements</Table.HeaderCell>
            <Table.HeaderCell>
              Setpoint interpolation (minutes)
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{settings.nominalRange}</Table.Cell>
            <Table.Cell>{settings.nominalDeltaRange}</Table.Cell>
            <Table.Cell>{settings.deltaMeasurements}</Table.Cell>
            <Table.Cell>{settings.interpolation}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>

      <Header as="h5">Setpoints</Header>
      <Table compact="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Time</Table.HeaderCell>
            <Table.HeaderCell>
              Setpoint (
              {quantityType.physicalUnitSymbol || quantityType.physicalUnit})
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {settings.setpoints.map((setpoint) => {
            return (
              <Table.Row key={setpoint.time}>
                <Table.Cell>{setpoint.time}</Table.Cell>
                <Table.Cell>{setpoint.value}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
};
