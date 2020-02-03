import React from "react";
import { RouteComponentProps } from "react-router";
import { Container } from "semantic-ui-react";
import { KitState } from "modules/kit/reducer";

import ResetPassword from "./components/ResetPassword";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params> & {
  kitState: KitState;
};

export default function KitConfigure(props: Props) {
  const { kitState } = props;

  return (
    <Container text>
        <ResetPassword kit={kitState.details.unwrap()} />
    </Container>
  );
}
