import React, { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Container, Card, Image, Icon } from "semantic-ui-react";

import { ConfigurationsContext } from "../../contexts";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params>;

export default function KitConfigure(props: Props) {
  const { url } = props.match;

  const configurations = useContext(ConfigurationsContext);

  const numConfigurations = Object.keys(configurations).length;

  return (
    <Container text>
      <p>
        <Link to={`${url}/create`}>Create a new configuration.</Link>
      </p>
      {numConfigurations > 0 ? (
        <Card.Group>
          {Object.entries(configurations).map(([id, configuration]) => {
            return (
              <Card fluid key={id} color="orange" as={Link} to={`${url}/${id}`}>
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
            );
          })}
        </Card.Group>
      ) : (
        <div>This kit has no configurations yet.</div>
      )}
    </Container>
  );
}
