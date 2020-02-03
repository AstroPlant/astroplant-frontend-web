import React from "react";
import { RouteComponentProps } from "react-router";
import { Container } from "semantic-ui-react";
import { KitState } from "modules/kit/reducer";

import RawMeasurements from "./components/RawMeasurements";
import AggregateMeasurements from "./components/AggregateMeasurements";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params> & {
  kitState: KitState
};

export default function KitOverview(props: Props) {
  const { kitState } = props;

  return (
      <Container text>
      <h2>Current measurements</h2>
      <RawMeasurements kitState={kitState} />
      <h2>Past measurements</h2>
      <AggregateMeasurements kitState={kitState} />
    </Container>
  );
}
