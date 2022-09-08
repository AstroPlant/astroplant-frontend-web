import React from "react";
import { Card, CardProps } from "semantic-ui-react";
import { PeripheralDefinition } from "astroplant-api";

export type Props = CardProps & {
  peripheralDefinition: PeripheralDefinition;
};

export default (props: Props) => {
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
};
