import React from "react";
import compose from "~/utils/compose";
import { withTranslation, WithTranslation } from "react-i18next";

import { FieldProps } from "@rjsf/utils";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMapEvent,
} from "react-leaflet";
import { Button } from "semantic-ui-react";
import { MarkerIcon } from "~/Components/MarkerIcon";

type State = {
  latitude: number | null;
  longitude: number | null;
};

type InnerProps = FieldProps & WithTranslation;

function MapListener({
  click,
}: {
  click: (latLng: { lat: number; lng: number }) => unknown;
}) {
  useMapEvent("click", (event) => {
    const latLng = {
      lat: Math.round(event.latlng.lat * 10000) / 10000,
      lng: Math.round(event.latlng.lng * 10000) / 10000,
    };
    click(latLng);
  });

  return null;
}

class CoordinateField extends React.Component<InnerProps, State> {
  state: State = {
    latitude: null,
    longitude: null,
  };

  constructor(props: InnerProps) {
    super(props);
    this.state = {
      latitude: (props.formData || {}).latitude || null,
      longitude: (props.formData || {}).longitude || null,
    };
  }

  componentDidMount() {
    if (this.state.latitude === null || this.state.longitude === null) {
      this.props.onChange(undefined);
    }
  }

  onChange(latLng: { lat: number | null; lng: number | null }) {
    this.setState({ latitude: latLng.lat, longitude: latLng.lng }, () => {
      if (this.state.latitude === null || this.state.longitude === null) {
        this.props.onChange(undefined);
      } else {
        this.props.onChange(this.state);
      }
    });
  }

  render() {
    const { t } = this.props;
    const { latitude, longitude } = this.state;
    return (
      <div>
        <p>
          <strong>Kit location</strong>
        </p>
        <p>Select a position on the map to set as your kit's location</p>
        <MapContainer center={[35, 0]} zoom={2} style={{ height: "45em" }}>
          <MapListener click={(latLng) => this.onChange(latLng)} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          {typeof latitude === "number" && typeof longitude === "number" && (
            <Marker icon={MarkerIcon} position={[latitude!, longitude!]}>
              <Popup>
                <h3>{t("common.position")}</h3>
                <p>
                  {t("common.latitude")}: {latitude.toFixed(4)}
                  <br />
                  {t("common.longitude")}: {longitude.toFixed(4)}
                </p>
                <p>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      this.onChange({ lat: null, lng: null });
                    }}
                  >
                    {t("common.remove")}
                  </Button>
                </p>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    );
  }
}

export default compose<InnerProps, FieldProps>(withTranslation())(
  CoordinateField,
);
