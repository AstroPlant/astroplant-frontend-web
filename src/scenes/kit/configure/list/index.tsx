import React from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Container, Card, Image, Icon } from "semantic-ui-react";
import { KitState } from "modules/kit/reducer";

import Option from "utils/option";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params> & {
  kit: KitState;
};

export default function KitConfigure(props: Props) {
  const { kit } = props;
  const { url } = props.match;

  const numConfigurations = Object.keys(kit.configurations).length;

  return (
    <Container text>
      <p>
        <Link to={`${url}/create`}>Create a new configuration.</Link>
      </p>
      {numConfigurations > 0 ? (
        <Card.Group>
          {Object.keys(kit.configurations).map(id => {
            const configuration = Option.from(kit.configurations[id]);
            return configuration
              .map(configuration => (
                <Card
                  fluid
                  key={id}
                  color="orange"
                  as={Link}
                  to={`${url}/${id}`}
                >
                  <Card.Content>
                    {configuration.neverUsed && (
                      <Image floated="right" size="mini">
                        <Icon title="Editable, never used" name="asterisk" />
                      </Image>
                    )}
                    {configuration.active && (
                      <Image floated="right" size="mini">
                        <Icon title="Currently active" name="exclamation" />
                      </Image>
                    )}
                    <Card.Header>{configuration.description}</Card.Header>
                    <Card.Meta>Identifier: #{configuration.id}</Card.Meta>
                  </Card.Content>
                </Card>
              ))
              .unwrapOrNull();
          })}
        </Card.Group>
      ) : (
        <div>This kit has no configurations yet.</div>
      )}
    </Container>
  );
}
