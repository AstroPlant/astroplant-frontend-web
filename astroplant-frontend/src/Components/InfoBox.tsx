import React, { Component } from "react";
import { Grid, Icon, Button, Header, SemanticICONS } from "semantic-ui-react";
import { withRouter } from "react-router-dom";
import { RouteComponentProps } from "react-router";

type InfoBoxProps = RouteComponentProps<{}> & {
  icon: SemanticICONS,
  header: string,
  body: string,
  button: string,
  route: string
}

class InfoBox extends Component<InfoBoxProps> {
  nextPath(path: any) {
    this.props.history.push(path);
  }

  render() {
    return (
      <Grid.Column textAlign="center">
        <Header as="h2">
          <Icon.Group size="large">
            <Icon name={this.props.icon} />
          </Icon.Group>
          {this.props.header}
        </Header>
        <p>{this.props.body}</p>
        <Button
          basic
          content={this.props.button}
          onClick={() => this.nextPath(this.props.route)}
        />
      </Grid.Column>
    );
  }
}

export default withRouter(InfoBox);
