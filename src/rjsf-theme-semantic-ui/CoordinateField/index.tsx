import React from "react";
import { compose } from "recompose";
import { withTranslation, WithTranslation } from "react-i18next";

import { FieldProps } from "react-jsonschema-form";
import { Map, Marker, TileLayer, Popup } from "react-leaflet";
import { Button } from "semantic-ui-react";

type State = {
  latitude: number | null;
  longitude: number | null;
};

type InnerProps = FieldProps & WithTranslation;

class CoordinateField extends React.Component<InnerProps, State> {
  state: State = {
    latitude: null,
    longitude: null
  };

  constructor(props: InnerProps) {
    super(props);
    this.state = {
      latitude: (props.formData || {}).latitude || null,
      longitude: (props.formData || {}).longitude || null
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
      <Map
        center={[35, 0]}
        zoom={2}
        height={200}
        style={{ height: "45em" }}
        onClick={(event: any) => {
          const latLng = {
            lat: Math.round(event.latlng.lat * 10000) / 10000,
            lng: Math.round(event.latlng.lng * 10000) / 10000
          };
          this.onChange(latLng);
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {typeof latitude === "number" && typeof longitude === "number" && (
          <Marker position={[latitude!, longitude!]}>
            <Popup>
              <h3>{t("common.position")}</h3>
              <p>
                {t("common.latitude")}: {latitude.toFixed(4)}
                <br />
                {t("common.longitude")}: {longitude.toFixed(4)}
              </p>
              <p>
                <Button onClick={() => this.onChange({ lat: null, lng: null })}>
                  {t("common.remove")}
                </Button>
              </p>
            </Popup>
          </Marker>
        )}
      </Map>
    );
  }
}

export default compose<InnerProps, FieldProps>(withTranslation())(
  CoordinateField
);
