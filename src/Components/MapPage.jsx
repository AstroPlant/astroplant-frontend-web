import React, { Component } from "react";
import HeadTitle from "./HeadTitle";
import { Container } from "semantic-ui-react";
import GoogleMap from "./GoogleMap";

class MapPage extends Component {
  render() {
    return (
      <div>
        <HeadTitle titulo="Map" texto="See Astroplant Kits Around the World." />
        <Container>
          <GoogleMap />
        </Container>
      </div>
    );
  }
}

export default MapPage;
