import React from "react";
import { Table } from "semantic-ui-react";
import { JSONSchema7 } from "json-schema";

import { Peripheral } from "astroplant-api";

import { OutputSettings } from "../schemas";

export type Props = {
  peripheral: Peripheral;
  command: string;
  schema: JSONSchema7;
  outputSettings: OutputSettings;
};

export default (props: Props) => {
  const { command, outputSettings: settings } = props;
  const { minimal: min, maximal: max } = settings.continuous;
  return (
    <>
      <div>
        <strong>{command}</strong>
      </div>
      <Table compact="very">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Minimal command value</Table.HeaderCell>
            <Table.HeaderCell>Low command value</Table.HeaderCell>
            <Table.HeaderCell>Medium command value</Table.HeaderCell>
            <Table.HeaderCell>High command value</Table.HeaderCell>
            <Table.HeaderCell>Maximal command value</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>{min.toPrecision(4)}</Table.Cell>
            <Table.Cell>{((max - min) * 0.25 + min).toPrecision(4)}</Table.Cell>
            <Table.Cell>{((max - min) * 0.5 + min).toPrecision(4)}</Table.Cell>
            <Table.Cell>{((max - min) * 0.75 + min).toPrecision(4)}</Table.Cell>
            <Table.Cell>{max.toPrecision(4)}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </>
  );
};
