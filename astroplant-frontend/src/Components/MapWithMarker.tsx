import React from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { MarkerIcon } from "./MarkerIcon";

type Props = {
  location: { latitude: number; longitude: number };
};

export default class MapWithMarker extends React.Component<
  React.PropsWithChildren<Props>
> {
  render() {
    const { location } = this.props;
    return (
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={10}
        style={{ height: "45em" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker
          icon={MarkerIcon}
          position={[location.latitude, location.longitude]}
        >
          {this.props.children && <Popup>{this.props.children}</Popup>}
        </Marker>
      </MapContainer>
    );
  }
}
