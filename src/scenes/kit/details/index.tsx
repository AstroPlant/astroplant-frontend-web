import { useContext, useState, useMemo } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Transition, Divider } from "semantic-ui-react";
import ReactMarkdown from "react-markdown";
import { IconCircleCheck } from "@tabler/icons-react";

import { removeNull, undefinedToNull, emptyStringToNull } from "~/utils/form";

import {
  schema as patchSchema,
  uiSchema as patchUiSchema,
} from "./patch-kit-schema";
import { RtkApiForm } from "~/Components/ApiForm";
import MapWithMarker from "~/Components/MapWithMarker";
import { ModalDialog } from "~/Components/ModalDialog";
import { Button } from "~/Components/Button";

import { KitContext, PermissionsContext } from "../contexts";

import commonStyle from "~/Common.module.css";
import style from "./index.module.css";
import { rtkApi } from "~/services/astroplant";
import Gravatar from "~/Components/Gravatar";

export default function KitDetails() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [done, setDone] = useState(false);

  const kit = useContext(KitContext);
  const permissions = useContext(PermissionsContext);

  const { data: kitMembers } = rtkApi.useGetKitMembersQuery({
    kitSerial: kit.serial,
  });
  const [patchKit] = rtkApi.usePatchKitMutation();

  const kitDetails = useMemo(() => {
    return removeNull({
      name: kit.name,
      description: kit.description,
      coordinate:
        typeof kit.latitude === "number" && typeof kit.longitude === "number"
          ? {
              latitude: kit.latitude,
              longitude: kit.longitude,
            }
          : null,
      privacyPublicDashboard: kit.privacyPublicDashboard,
      privacyShowOnMap: kit.privacyShowOnMap,
    });
  }, [kit]);
  const schema = useMemo(() => {
    return patchSchema(t);
  }, [t]);

  const patchTransform = (formData: any) => {
    const { coordinate, ...rest } = formData;
    if (typeof coordinate === "undefined") {
      return {
        latitude: null,
        longitude: null,
        ...rest,
      };
    } else {
      return {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        ...rest,
      };
    }
  };

  return (
    <section className={commonStyle.containerWide}>
      <h2>About</h2>
      <Routes>
        <Route
          path="/edit"
          element={
            <RtkApiForm
              idPrefix="patchKitForm"
              key={0}
              schema={schema as any}
              uiSchema={patchUiSchema as any}
              send={async (formData) => {
                const data = patchTransform(formData);
                const patch = emptyStringToNull(
                  undefinedToNull(data, [
                    "name",
                    "description",
                    "privacyPublicDashboard",
                    "privacyShowOnMap",
                  ]),
                );

                return await patchKit({
                  kitSerial: kit.serial,
                  patchKit: patch,
                });
              }}
              onResponse={(_response) => {
                setDone(true);
                navigate("");
              }}
              formData={kitDetails}
            />
          }
        />
        <Route
          path="/"
          element={
            <>
              {done && (
                <ModalDialog
                  open={true}
                  onClose={() => {
                    setDone(false);
                  }}
                  header={"Details were changed"}
                  actions={
                    <Button variant="positive" onClick={() => setDone(false)}>
                      Ok!
                    </Button>
                  }
                >
                  <div className={style.success}>
                    <Transition
                      animation="drop"
                      duration={450}
                      transitionOnMount
                    >
                      <div className={style.icon}>
                        <IconCircleCheck size={"5rem"} />
                      </div>
                    </Transition>
                    <header>Success!</header>
                    <p>Your kit's details have been changed.</p>
                  </div>
                </ModalDialog>
              )}
              <div className={style.details}>
                <div>
                  {kit.description && (
                    <section className={style.description}>
                      <header>Description</header>
                      <div>
                        <ReactMarkdown>{kit.description || ""}</ReactMarkdown>
                      </div>
                    </section>
                  )}
                  {typeof kit.latitude === "number" &&
                    typeof kit.longitude === "number" && (
                      <>
                        <h3>Kit location</h3>
                        <MapWithMarker
                          location={{
                            latitude: kit.latitude,
                            longitude: kit.longitude,
                          }}
                        >
                          <p>
                            {t("common.latitude")}: {kit.latitude.toFixed(4)}
                            <br />
                            {t("common.longitude")}: {kit.longitude.toFixed(4)}
                          </p>
                        </MapWithMarker>
                      </>
                    )}
                  {permissions.editDetails && (
                    <>
                      <Divider />
                      <Button
                        variant="primary"
                        onClick={() => navigate("edit")}
                      >
                        Edit kit details
                      </Button>
                    </>
                  )}
                </div>
                <div>
                  <h3>Kit members</h3>
                  {kitMembers !== undefined && (
                    <ul className={style.members}>
                      {kitMembers.map((kitMember) => (
                        <li>
                          <Link to={`/user/${kitMember.user.username}`}>
                            <Gravatar
                              identifier={kitMember.user.gravatar}
                              size={32}
                            />
                            <strong>{kitMember.user.displayName}</strong>
                            <span className={style.username}>
                              {kitMember.user.username}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          }
        />
      </Routes>
    </section>
  );
}
