import React, { useEffect, useState } from "react";
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

export default function CoordinateField(props: FieldProps) {
  const { onChange, formData } = props;
  const { t } = useTranslation();

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    setLatitude(formData?.latitude);
    setLongitude(formData?.longitude);
  }, [formData]);

  useEffect(() => {
    if (latitude === null || longitude === null) {
      onChange(undefined);
    } else {
      onChange({ latitude, longitude });
    }
  }, [onChange, latitude, longitude]);

  return (
    <div>
      <p>
        <strong>Kit location</strong>
      </p>
      <p>Select a position on the map to set as your kit's location</p>
      <MapContainer center={[35, 0]} zoom={2} style={{ height: "45em" }}>
        <MapListener
          click={(latLng) => {
            setLatitude(latLng.lat);
            setLongitude(latLng.lng);
          }}
        />
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
                    setLatitude(null);
                    setLongitude(null);
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
