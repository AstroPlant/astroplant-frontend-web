import React, { useEffect, useState } from "react";
import { reduce } from "rxjs/operators";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container, Segment, Divider } from "semantic-ui-react";
import { Map, Marker, TileLayer, Popup } from "react-leaflet";
import ReactMarkdown from "react-markdown";

import HeadTitle from "~/Components/HeadTitle";
import { walkPages } from "~/utils/api";

import { KitsApi, Kit } from "astroplant-api";
import { MarkerIcon } from "~/Components/MarkerIcon";

export default function KitMap() {
  const { t } = useTranslation();
  const [kits, setKits] = useState<Kit[] | null>(null);

  useEffect(() => {
    let mounted = true;

    const fn = async () => {
      const api = new KitsApi();
      const kits = await walkPages((id) => {
        if (typeof id !== "undefined") {
          return api.listKits({ after: id });
        } else {
          return api.listKits({});
        }
      })
        .pipe(reduce((all: Array<Kit>, val: Array<Kit>) => all.concat(val), []))
        .toPromise();

      if (mounted) {
        setKits(kits);
      }
    };

    fn();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <HeadTitle main="Map" secondary="See Astroplant kits around the world" />
      <Container style={{ paddingTop: "1rem" }}>
        <Segment attached="top" secondary>
          <p>{t("map.description")}</p>
        </Segment>
        <Segment attached="bottom" style={{ padding: 0 }}>
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
            {kits === null ? (
              <></>
            ) : (
              kits.map((kit) => {
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
        </Segment>
      </Container>
    </div>
  );
}
