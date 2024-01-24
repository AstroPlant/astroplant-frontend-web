import L from "leaflet";
import mapMarker from "../assets/map-marker.svg";

export const MarkerIcon = new L.Icon({
  iconUrl: mapMarker,
  inconRetinaUrl: mapMarker,
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  popupAnchor: [1, -34],
});
