import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

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

export type Field = {
  latitude: string | number | null;
  longitude: string | number | null;
};

const NUM_DIGITS = 4;

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

export default function CoordinateField(props: FieldProps<Field>) {
  const { onChange, formData } = props;
  const { t } = useTranslation();

  // Ensure latitude and longitude are numbers, not strings.
  useEffect(() => {
    let changed = false;
    let latitude = formData?.latitude ?? null;
    let longitude = formData?.longitude ?? null;

    if (typeof formData?.latitude === "string") {
      changed = true;
      latitude = parseFloat(formData?.latitude ?? "");
    }
    if (typeof formData?.longitude === "string") {
      changed = true;
      longitude = parseFloat(formData?.longitude ?? "");
    }

    if (changed) {
      onChange({ latitude, longitude });
    }
  }, [formData]);

  const { latitude, longitude } = formData ?? {};

  return (
    <div>
      <p>
        <strong>Kit location</strong>
      </p>
      <p>Select a position on the map to set as your kit's location</p>
      <MapContainer center={[35, 0]} zoom={2} style={{ height: "45em" }}>
        <MapListener
          click={(latLng) => {
            onChange({
              latitude: latLng.lat.toFixed(NUM_DIGITS),
              longitude: latLng.lng.toFixed(NUM_DIGITS),
            });
          }}
        />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {typeof latitude === "number" && typeof longitude === "number" && (
          <Marker icon={MarkerIcon} position={[latitude, longitude]}>
            <Popup>
              <h3>{t("common.position")}</h3>
              <p>
                {t("common.latitude")}: {latitude}
                <br />
                {t("common.longitude")}: {longitude}
              </p>
              <p>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange({ latitude: null, longitude: null });
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
