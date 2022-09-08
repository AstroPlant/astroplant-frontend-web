import React, { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Container, Card, Label, Button } from "semantic-ui-react";

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
        <Link to={`${url}/create`}><Button primary>Create a new configuration.</Button></Link>
      </p>
      {numConfigurations > 0 ? (
        <Card.Group>
          {Object.entries(configurations).map(([id, configuration]) => {
            return (
              <Card fluid key={id} color="orange" as={Link} to={`${url}/${id}`}>
                <Card.Content>
                  {configuration.neverUsed && (
                    <Label attached="bottom right" color="black">
                      Never used (editable)
                    </Label>
                  )}
                  {configuration.active && (
                    <Label attached="bottom right" color="black">
                      Currently active
                    </Label>
                  )}
                  <Card.Header>{configuration.description}</Card.Header>
                  <Card.Meta>Identifier: #{configuration.id}</Card.Meta>
                </Card.Content>
              </Card>
            );
          })}
        </Card.Group>
      ) : (
        <div>
          <p>This kit has no configurations yet.</p>
          <p>To continue setting up your kit, check out the documentation <a target="_blank" href="https://docs.astroplant.io/astroplant-kit-setup/registering-and-configuring-a-kit">here</a></p>
        </div>
      )}
    </Container>
  );
}
