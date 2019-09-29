import React from "react";
import { Link } from "react-router-dom";
import { Container, Header, Segment } from "semantic-ui-react";

import HeadTitle from "../Components/HeadTitle";

export default function TermsAndConditions() {
  return (
    <>
      <HeadTitle main="Oh no!" />
      <Container text style={{ marginTop: "1em" }}>
        <Segment piled>
          <Header>That page was not found</Header>
          <p>The page you browsed to could not be found.</p>
          <p>Consider going to the <Link to="/home">home page</Link>.</p>
        </Segment>
      </Container>
    </>
  );
}
