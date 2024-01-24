import React from "react";
import { Table, Header, Divider } from "semantic-ui-react";
import { JSONSchema7 } from "json-schema";

import { OutputSettings, ScheduledOutputSettings } from "~/control/types";
import { schemas } from "~/api";

export type Props = {
  peripheral: schemas["Peripheral"];
  command: string;
  schema: JSONSchema7;
  outputSettings: OutputSettings;
};

export default function ViewOutput(props: Props) {
  const { command, outputSettings: settings } = props;

  if (settings.type === "continuous") {
    let min, max;
    try {
      ({ minimal: min, maximal: max } = settings.continuous!);
    } catch (_e) {
      // TODO Use better defaults (perhaps from props.schema?)
      min = 0;
      max = 100;
    }

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
              <Table.Cell>
                {((max - min) * 0.25 + min).toPrecision(4)}
              </Table.Cell>
              <Table.Cell>
                {((max - min) * 0.5 + min).toPrecision(4)}
              </Table.Cell>
              <Table.Cell>
                {((max - min) * 0.75 + min).toPrecision(4)}
              </Table.Cell>
              <Table.Cell>{max.toPrecision(4)}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </>
    );
  } else if (settings.type === "scheduled") {
    let interpolated, schedules;
    try {
      ({ interpolated, schedules } = settings.scheduled!);
    } catch (_e) {
      ({ interpolated, schedules } = {
        interpolated: false,
        schedules: [],
      } as ScheduledOutputSettings);
    }

    return (
      <>
        <div>
          <strong>{command}</strong>
        </div>
        <div>{interpolated ? "Interpolated" : "Not interpolated"}</div>
        <Header as="h4">Schedules</Header>
        {schedules.map((schedule, index) => (
          <div key={index}>
            <Header as="h5">{`Schedule #${index + 1}`}</Header>
            <Table compact="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Time</Table.HeaderCell>
                  <Table.HeaderCell>Command</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {schedule.schedule.map((command, index) => (
                  <Table.Row key={index}>
                    <Table.Cell>{command.time}</Table.Cell>
                    <Table.Cell>{command.value}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <Divider />
          </div>
        ))}
      </>
    );
  } else {
    return <div>Unknown output type.</div>;
  }
}
