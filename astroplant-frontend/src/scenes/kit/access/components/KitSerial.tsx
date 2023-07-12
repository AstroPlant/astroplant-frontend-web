import React from "react";
import { Card } from "semantic-ui-react";
import { schemas } from "~/api";

export type Props = {
  kit: schemas["Kit"];
};

export default function KitSerial({ kit }: Props) {
  return (
    <Card color="orange" centered raised fluid>
      <Card.Content>
        <Card.Header>Kit serial</Card.Header>
        <Card.Description>{kit.serial}</Card.Description>
      </Card.Content>
    </Card>
  );
}
