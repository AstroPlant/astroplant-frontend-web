import React from "react";
import { RouteComponentProps } from "react-router";
import { Container } from "semantic-ui-react";
import { KitState } from "modules/kit/reducer";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params> & {
  kit: KitState
};

export default function KitOverview(props: Props) {
  const { kit } = props;

  return (
    <Container text>
      Overview page for {kit.name || kit.serial}
    </Container>
  );
}
