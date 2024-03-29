import React from "react";
import { Card, CardProps } from "semantic-ui-react";
import { schemas } from "~/api";

export type Props = CardProps & {
  peripheralDefinition: schemas["PeripheralDefinition"];
};

export default function PeripheralDefinitionCard(props: Props) {
  const { peripheralDefinition: def, ...rest } = props;
  return (
    <Card color="black" {...rest}>
      <Card.Content>
        <Card.Header>{def.name}</Card.Header>
        {def.description && (
          <Card.Description>{def.description}</Card.Description>
        )}
        <Card.Meta>
          {def.brand} - {def.model}
        </Card.Meta>
      </Card.Content>
    </Card>
  );
}
