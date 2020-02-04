import React from "react";
import { Map, Marker, TileLayer } from "react-leaflet";

type Props = {
  location: { latitude: number; longitude: number };
};

export default class MapWithMarker extends React.Component<Props> {
  render() {
    const { location } = this.props;
    return (
      <Map
        center={[location.latitude, location.longitude]}
        zoom={10}
        height={400}
        style={{ height: "45em" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={[location.latitude, location.longitude]} />
      </Map>
    );
  }
}
