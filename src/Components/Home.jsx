import React, { Component } from "react";
import { Container } from "semantic-ui-react";

import HeadTitle from "./HeadTitle";
import Info from "./Info";

class Home extends Component {
  render() {
    return (
      <div>
        <HeadTitle titulo="AstroPlant Prototype" texto="Be a Space Farmer" />
        <Container>
          <Info />
        </Container>
      </div>
    );
  }
}

export default Home;
