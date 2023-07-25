import React, { Component } from "react";
import { Grid, Container } from "semantic-ui-react";

type HeadTitleProps = {
  main?: string;
  secondary?: string;
};

class HeadTitle extends Component<HeadTitleProps, {}> {
  render() {
    return (
      <div className="headTitleBackground">
        <Container>
          <Grid verticalAlign="middle" padded>
            <Grid.Row>
              <Grid.Column>
                {this.props.main !== undefined && <h1>{this.props.main}</h1>}
                {this.props.secondary !== undefined && (
                  <p>{this.props.secondary}</p>
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default HeadTitle;
