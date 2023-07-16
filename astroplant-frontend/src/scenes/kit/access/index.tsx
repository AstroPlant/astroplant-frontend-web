import React, { useContext } from "react";
import { Container } from "semantic-ui-react";

import { KitContext } from "../contexts";
import KitSerial from "./components/KitSerial";
import ResetPassword from "./components/ResetPassword";

export default function KitConfigure() {
  const kit = useContext(KitContext);

  return (
    <Container text>
      <KitSerial kit={kit} />
      <ResetPassword kit={kit} />
    </Container>
  );
}
