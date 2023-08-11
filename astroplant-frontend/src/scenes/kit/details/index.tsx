import React, { useContext, useState, useMemo } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  Container,
  Segment,
  Transition,
  Icon,
  Header,
  Divider,
} from "semantic-ui-react";
import ReactMarkdown from "react-markdown";
import { removeNull, undefinedToNull, emptyStringToNull } from "~/utils/form";

import { addKit } from "~/modules/kit/actions";

import {
  schema as patchSchema,
  uiSchema as patchUiSchema,
} from "./patch-kit-schema";
import ApiForm from "~/Components/ApiForm";
import MapWithMarker from "~/Components/MapWithMarker";

import { KitContext, MembershipContext } from "../contexts";
import { useAppDispatch } from "~/hooks";
import { Response, api, schemas } from "~/api";

const PatchKitForm = ApiForm<any, Response<schemas["Kit"]>>();

export default function KitDetails() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [done, setDone] = useState(false);

  const kit = useContext(KitContext);
  const membership = useContext(MembershipContext);

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

  const canEditDetails = membership.map((m) => m.accessSuper).unwrapOr(false);

  return (
    <Container text>
      <Segment padded>
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
                  <>
                    <Header size="huge" icon textAlign="center">
                      <Transition
                        animation="drop"
                        duration={450}
                        transitionOnMount
                      >
                        <Icon name="check" circular />
                      </Transition>
                      <Header.Content>Success!</Header.Content>
                    </Header>
                    <p>Your kit's details have been changed.</p>
                    <Divider />
                  </>
                )}
                <div>
                  {canEditDetails && (
                    <Button onClick={() => navigate("edit")} primary>
                      Edit kit details
                    </Button>
                  )}
                  <h3>{kit.name || kit.serial}</h3>
                  <ReactMarkdown>{kit.description || ""}</ReactMarkdown>
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
                </div>
              </>
            }
          />
        </Routes>
      </Segment>
    </Container>
  );
}
