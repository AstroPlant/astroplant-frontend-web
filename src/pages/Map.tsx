import React, { Component } from "react";
import HeadTitle from "../Components/HeadTitle";
import { Container } from "semantic-ui-react";
import GoogleMap from "../Components/GoogleMap";

class MapPage extends Component {
  render() {
    return (
      <div>
        <HeadTitle main="Map" secondary="See Astroplant kits around the world" />
        <Container>
          <GoogleMap />
        </Container>
      </div>
    );
  }
}

export default MapPage;
