import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container, Segment, Divider } from "semantic-ui-react";
import { Map, Marker, TileLayer, Popup } from "react-leaflet";
import ReactMarkdown from "react-markdown";

import HeadTitle from "~/Components/HeadTitle";

import { MarkerIcon } from "~/Components/MarkerIcon";
import { rtkApi } from "~/services/astroplant";
import Loading from "~/Components/Loading";

export default function KitMap() {
  const { t } = useTranslation();

  const {
    data: kitsData,
    isLoading: kitsIsLoading,
    error: kitsError_,
  } = rtkApi.useListKitsQuery();

  return (
    <div>
      <HeadTitle main="Map" secondary="See Astroplant kits around the world" />
      <Container style={{ paddingTop: "1rem" }}>
        <Segment attached="top" secondary>
          <p>{t("map.description")}</p>
        </Segment>
        <Segment attached="bottom" style={{ padding: 0 }}>
          {kitsIsLoading ? (
            <Loading />
          ) : (
            <Map
              center={[35, 0]}
              zoom={2}
              height={400}
              style={{ height: "45em" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {kitsData === undefined ? (
                <></>
              ) : (
                kitsData.map((kit) => {
                  if (
                    typeof kit.latitude == "number" &&
                    typeof kit.longitude == "number"
                  ) {
                    return (
                      <Marker
                        position={[kit.latitude!, kit.longitude!]}
                        key={kit.id}
                        icon={MarkerIcon}
                      >
                        <Popup>
                          <h3>{kit.name || t("kit.unnamed")}</h3>
                          {kit.description && (
                            <>
                              <Divider />
                              <ReactMarkdown>{kit.description}</ReactMarkdown>
                            </>
                          )}
                          <Divider />
                          {kit.privacyPublicDashboard ? (
                            <div>
                              <Link to={`/kit/${kit.serial}`}>
                                {t("map.goToDashboard")}
                              </Link>
                            </div>
                          ) : (
                            <p>{t("map.privateDashboard")}</p>
                          )}
                        </Popup>
                      </Marker>
                    );
                  } else {
                    return null;
                  }
                })
              )}
            </Map>
          )}
        </Segment>
      </Container>
    </div>
  );
}
