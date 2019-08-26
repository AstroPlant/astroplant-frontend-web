import React, { Component } from "react";
import { Grid, Icon, Button, Header } from "semantic-ui-react";
import { withRouter } from "react-router-dom";

class InfoRecuadro extends Component {
  nextPath(path) {
    this.props.history.push(path);
  }

  render() {
    return (
      <Grid.Column textAlign="center">
        <Header as="h2">
          <Icon.Group size="large">
            <Icon name={this.props.icon} />
          </Icon.Group>
          {this.props.head_text}
        </Header>
        <p>{this.props.p_text}</p>
        <Button
          basic
          content={this.props.button_text}
          onClick={() => this.nextPath(this.props.ruta)}
        />
      </Grid.Column>
    );
  }
}

export default withRouter(InfoRecuadro);
