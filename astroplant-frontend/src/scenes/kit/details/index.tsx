import { useContext, useState, useMemo } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Transition, Divider } from "semantic-ui-react";
import ReactMarkdown from "react-markdown";
import { IconCircleCheck } from "@tabler/icons-react";

import { removeNull, undefinedToNull, emptyStringToNull } from "~/utils/form";
import { addKit } from "~/modules/kit/actions";

import {
  schema as patchSchema,
  uiSchema as patchUiSchema,
} from "./patch-kit-schema";
import ApiForm from "~/Components/ApiForm";
import MapWithMarker from "~/Components/MapWithMarker";
import { ModalDialog } from "~/Components/ModalDialog";
import { Button } from "~/Components/Button";
import { useAppDispatch } from "~/hooks";
import { Response, api, schemas } from "~/api";

import { KitContext, PermissionsContext } from "../contexts";

import commonStyle from "~/Common.module.css";
import style from "./index.module.css";

const PatchKitForm = ApiForm<any, Response<schemas["Kit"]>>();

export default function KitDetails() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [done, setDone] = useState(false);

  const kit = useContext(KitContext);
  const permissions = useContext(PermissionsContext);

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

  const patchSend = (formData: any) => {
    return api.patchKit({
      kitSerial: kit.serial,
      patchKit: emptyStringToNull(
        undefinedToNull(formData, [
          "name",
          "description",
          "privacyPublicDashboard",
          "privacyShowOnMap",
        ]),
      ),
    });
  };

  const onPatchResponse = (response: Response<schemas["Kit"]>) => {
    dispatch(addKit(response.data));
    setDone(true);
    navigate("");
  };

  return (
    <section className={commonStyle.containerRegular}>
      <h2>About</h2>
      <Routes>
        <Route
          path="/edit"
          element={
            <PatchKitForm
              idPrefix="patchKitForm"
              key={0}
              schema={schema as any}
              uiSchema={patchUiSchema as any}
              transform={(formData) => patchTransform(formData)}
              send={(formData) => patchSend(formData)}
              onResponse={(formData) => onPatchResponse(formData)}
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
                      <Divider />
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
                    <Button variant="primary" onClick={() => navigate("edit")}>
                      Edit kit details
                    </Button>
                  </>
                )}
              </div>
            </>
          }
        />
      </Routes>
    </section>
  );
}
