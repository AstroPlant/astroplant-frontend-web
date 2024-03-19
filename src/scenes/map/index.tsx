import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Segment, Divider } from "semantic-ui-react";
import { Marker, TileLayer, Popup, MapContainer } from "react-leaflet";
import ReactMarkdown from "react-markdown";

import HeadTitle from "~/Components/HeadTitle";

import { MarkerIcon } from "~/Components/MarkerIcon";
import { rtkApi } from "~/services/astroplant";
import Loading from "~/Components/Loading";

import commonStyle from "~/Common.module.css";

export default function KitMap() {
  const { t } = useTranslation();

  const {
    data: kitsData,
    isLoading: kitsIsLoading,
    error: kitsError,
  } = rtkApi.useListKitsQuery({});

  return (
    <div>
      <HeadTitle main="Map" secondary="See Astroplant kits around the world" />
      {!kitsIsLoading && kitsError !== undefined && (
        <section
          className={commonStyle.containerWide}
          style={{ marginTop: "1rem" }}
        >
          <p>Could not fetch the list of kits.</p>
        </section>
      )}
      <section
        className={commonStyle.containerWide}
        style={{ marginTop: "1rem" }}
      >
        <Segment attached="top" secondary>
          <p>{t("map.description")}</p>
        </Segment>
        <Segment attached="bottom" style={{ padding: 0 }}>
          {kitsIsLoading ? (
            <Loading />
          ) : (
            <MapContainer center={[35, 0]} zoom={2} style={{ height: "45em" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {kitsData !== undefined &&
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
                })}
            </MapContainer>
          )}
        </Segment>
      </section>
    </div>
  );
}
