import React, { Component } from 'react'
import HeadTitle from './HeadTitle';
import { Container, Input, Button, Grid } from 'semantic-ui-react';

export default class LogInPage extends Component {
  render() {
    return (
      <div>
        <HeadTitle titulo="LogIn" />
        <Container  >
            <Grid columns={1} textAlign="center">
                <Grid.Row style={{paddingTop:"3em"}} ><Input placeholder="Email"/></Grid.Row>
                <Grid.Row><Input placeholder="Password"/></Grid.Row>
                <Grid.Row><Button basic content="Login"/></Grid.Row>
                <Grid.Row><p>Forgot Password?</p></Grid.Row>
            </Grid>
        </Container>
      </div>
    )
  }
}
