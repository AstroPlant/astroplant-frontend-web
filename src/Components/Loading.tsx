import React from "react";
import { Container, Segment, Placeholder } from "semantic-ui-react";

export default function Loading() {
  return (
    <Container>
      <Segment>
        <Placeholder fluid={true}>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </Segment>
    </Container>
  );
}
