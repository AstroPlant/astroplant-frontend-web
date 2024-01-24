import React from "react";
import { Container, Segment, Placeholder } from "semantic-ui-react";

import style from "./Loading.module.css";

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

export type SpinnerProps = {
  size?: string | number;
};

export function Spinner({ size = "1em" }) {
  return (
    <div
      style={{ fontSize: size }}
      className={style.spinner}
      aria-label="Loading"
    />
  );
}
