import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Container,
  Segment,
  Header,
  Transition,
  Icon,
  Card,
  Input,
} from "semantic-ui-react";

import { JSONSchema7 } from "json-schema";

import { withAuthentication } from "~/Components/AuthenticatedGuard";
import HeadTitle from "~/Components/HeadTitle";
import { Response, api, schemas } from "~/api";
import { useAppDispatch } from "~/hooks";
import { kitCreated } from "~/modules/me/actions";
import ApiForm from "~/Components/ApiForm";

const CreateKitForm = ApiForm<
  any,
  Response<{ kitSerial: string; password: string }>
>();

function CreateKit() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [done, setDone] = useState(false);
  const [result, setResult] = useState<{
    kitSerial: string;
    password: string;
  } | null>(null);

  const onResponse = (
    response: Response<{ kitSerial: string; password: string }>
  ) => {
    dispatch(kitCreated());
    setDone(true);
    setResult(response.data);
  };

  const transform = (formData: any): schemas["NewKit"] => {
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

  const send = (formData: any) => {
    return api.createKit({ newKit: formData });
  };

  const schema: JSONSchema7 = {
    type: "object",
    title: "Kit details",
    required: [],
    properties: {
      name: { type: "string", title: t("common.name") },
      description: { type: "string", title: t("common.description") },
      coordinate: {
        type: "object",
        required: ["latitude", "longitude"],
        properties: {
          latitude: { type: "number", title: t("common.latitude") },
          longitude: { type: "number", title: t("common.longitude") },
        },
      },
      privacyPublicDashboard: {
        type: "boolean",
        default: true,
        title: t("kit.privacyPublicDashboard"),
      },
      privacyShowOnMap: {
        type: "boolean",
        default: true,
        title: t("kit.privacyShowOnMap"),
      },
    },
  };

  const uiSchema = {
    description: {
      "ui:widget": "textarea",
    },
    coordinate: {
      "ui:field": "CoordinateField",
    },
  };

  return (
    <>
      <HeadTitle main={t("createKit.header")} />
      <Container text style={{ marginTop: "1em" }}>
        <Segment padded>
          {done ? (
            <>
              <Header size="huge" icon textAlign="center">
                <Transition animation="drop" duration={450} transitionOnMount>
                  <Icon name="check" circular />
                </Transition>
                <Header.Content>Success!</Header.Content>
              </Header>
              <Container textAlign="center">
                <p>
                  Your kit has been created. A password has been generated as
                  well.
                </p>
                <p>
                  <strong>This password will not be shown again.</strong>
                </p>
                <p>
                  If you lose it,{" "}
                  <strong>you can always generate a new password</strong> from
                  the kit's configuration screen.
                </p>
                <p>
                  This password and the kit's serial number should be added to{" "}
                  <code>kit_config.toml</code> file in the home directory of the
                  kit. <code>/home/pi</code>
                  <br />
                  Read more about setting up the password{" "}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://docs.astroplant.io/astroplant-kit-setup/astroplant-software/quick-software-setup#installing-the-bare-image"
                  >
                    here
                  </a>
                </p>
                <Card color="orange" centered raised fluid>
                  <Card.Content>
                    <Card.Header>Kit password</Card.Header>
                    <Card.Description>
                      <Input
                        fluid
                        icon={<Icon name="lock" inverted circular link />}
                        value={result?.password ?? ""}
                        readOnly
                      />
                    </Card.Description>
                  </Card.Content>
                </Card>
                <p>
                  <Link to={`/kit/${result?.kitSerial ?? ""}`}>Click here</Link>{" "}
                  to go to its dashboard.
                </p>
              </Container>
            </>
          ) : (
            <>
              <CreateKitForm
                schema={schema}
                uiSchema={uiSchema}
                transform={transform}
                send={send}
                onResponse={onResponse}
                submitLabel={t("createKit.create")}
              />
            </>
          )}
        </Segment>
      </Container>
    </>
  );
}

export default withAuthentication()(CreateKit);
