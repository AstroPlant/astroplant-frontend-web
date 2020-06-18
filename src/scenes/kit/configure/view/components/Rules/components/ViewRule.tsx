import React from "react";
import { Table, Header } from "semantic-ui-react";

import { FuzzyRule } from "../schemas";

export type Props = {
  index: number;
  fuzzyRule: FuzzyRule;
};

export default (props: Props) => {
  const { fuzzyRule } = props;
  return (
    <>
      Active from <strong>{fuzzyRule.activeFrom}</strong> to{" "}
      <strong>{fuzzyRule.activeTo}</strong>.
      <Header as="h5">Input conditions</Header>
      <Table compact="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Negation</Table.HeaderCell>
            <Table.HeaderCell>Hedge</Table.HeaderCell>
            <Table.HeaderCell>Delta</Table.HeaderCell>
            <Table.HeaderCell>Peripheral</Table.HeaderCell>
            <Table.HeaderCell>Quantity type</Table.HeaderCell>
            <Table.HeaderCell>Error/Deviation</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fuzzyRule.condition.map((condition) => {
            return (
              <Table.Row
                key={`${condition.peripheral}-${condition.quantityType}`}
              >
                <Table.Cell>{condition.negation ? "X" : ""}</Table.Cell>
                <Table.Cell>{condition.hedge || ""}</Table.Cell>
                <Table.Cell>{condition.delta ? "X" : ""}</Table.Cell>
                <Table.Cell>{condition.peripheral}</Table.Cell>
                <Table.Cell>{condition.quantityType}</Table.Cell>
                <Table.Cell>{condition.fuzzyVariable}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <Header as="h5">Output implications</Header>
      <Table compact="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Peripheral</Table.HeaderCell>
            <Table.HeaderCell>Command</Table.HeaderCell>
            <Table.HeaderCell>Output</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {fuzzyRule.implication.map((implication) => {
            return (
              <Table.Row
                key={`${implication.peripheral}-${implication.command}`}
              >
                <Table.Cell>{implication.peripheral}</Table.Cell>
                <Table.Cell>{implication.command}</Table.Cell>
                <Table.Cell>{implication.fuzzyVariable}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </>
  );
};
