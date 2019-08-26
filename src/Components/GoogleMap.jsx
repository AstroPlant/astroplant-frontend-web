import React, { Component } from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => (
  <div
    style={{
      color: "white",
      background: "lightgrey",
      padding: "15px 10px",
      display: "inline-flex",
      textAlign: "center",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "10%",
      transform: "translate(-50%, -50%)"
    }}
  >
    {text}
  </div>
);

class GoogleMap extends Component {
  static defaultProps = {
    center: { lat: 40.416705, lng: -3.703582 },
    zoom: 6
  };

  render() {
    return (
      <div style={{ height: "100vh", width: "100%", paddingTop: "2em" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDZiNsXrX1lhcMIQMPleLZe89LinfdYMq0" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent
            lat={40.416705}
            lng={-3.703582}
            text={"Madrid Prueba"}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default GoogleMap;
