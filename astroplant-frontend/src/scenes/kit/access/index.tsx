import React, { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { Container } from "semantic-ui-react";

import { KitContext } from "../contexts";
import KitSerial from "./components/KitSerial";
import ResetPassword from "./components/ResetPassword";

export type Props = RouteComponentProps<{}>;

export default function KitConfigure(_props: Props) {
  const kit = useContext(KitContext);

  return (
    <Container text>
      <KitSerial kit={kit} />
      <ResetPassword kit={kit} />
    </Container>
  );
}
