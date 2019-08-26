import React, { Component } from "react";
import HeadTitle from "./HeadTitle";
import { Container, Input, Button, Grid, Checkbox } from "semantic-ui-react";

class SignUpPage extends Component {
  render() {
    return (
      <div>
        <HeadTitle titulo="Create Account" />
        <Container>
          <Grid columns={1} textAlign="center">
            <Grid.Row style={{ paddingTop: "3em" }}>
              <Input placeholder="User Name" />
            </Grid.Row>
            <Grid.Row>
              <Input placeholder="Email" />
            </Grid.Row>
            <Grid.Row>
              <Input placeholder="Password" />
            </Grid.Row>
            <Grid.Row>
              <Input placeholder="Repeat Password" />
            </Grid.Row>
            <Grid.Row>
              <Checkbox label="Read Terms of service" />
            </Grid.Row>
            <Grid.Row>
              <Button basic content="Create Account" />
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default SignUpPage;
