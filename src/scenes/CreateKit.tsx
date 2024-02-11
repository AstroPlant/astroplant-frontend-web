import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Container,
  Header,
  Transition,
  Icon,
  Card,
  Input,
} from "semantic-ui-react";

import { JSONSchema7 } from "json-schema";

import { withAuthentication } from "~/Components/AuthenticatedGuard";
import { RtkApiForm } from "~/Components/ApiForm";

import commonStyle from "~/Common.module.css";
import { rtkApi } from "~/services/astroplant";

function CreateKit() {
  const { t } = useTranslation();

  const [done, setDone] = useState(false);
  const [result, setResult] = useState<{
    kitSerial: string;
    password: string;
  } | null>(null);
  const [createKit] = rtkApi.useCreateKitMutation();

  const onResponse = (response: { kitSerial: string; password: string }) => {
    setDone(true);
    setResult(response);
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
      <article
        className={commonStyle.containerRegular}
        style={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        <h2>{t("createKit.header")}</h2>
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
                <strong>you can always generate a new password</strong> from the
                kit's configuration screen.
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
                .
              </p>
              <Card color="orange" centered raised fluid>
                <Card.Content>
                  <Card.Header>Kit serial</Card.Header>
                  <Card.Description>
                    <Input
                      fluid
                      icon={<Icon name="lock" inverted circular link />}
                      value={result?.kitSerial ?? ""}
                      onClick={(ev: any) => ev.target.select()}
                      readOnly
                    />
                  </Card.Description>
                </Card.Content>
              </Card>
              <Card color="orange" centered raised fluid>
                <Card.Content>
                  <Card.Header>Kit password</Card.Header>
                  <Card.Description>
                    <Input
                      fluid
                      icon={<Icon name="lock" inverted circular link />}
                      value={result?.password ?? ""}
                      onClick={(ev: any) => ev.target.select()}
                      readOnly
                    />
                  </Card.Description>
                </Card.Content>
              </Card>
              <p>
                <Link to={`/kit/${result?.kitSerial ?? ""}`}>Click here</Link>{" "}
                to go to the dashboard of the kit you just created.
              </p>
            </Container>
          </>
        ) : (
          <>
            <p>
              Once the kit has been created, you can create configurations for
              it. To use the kit on your device, copy the credentials that will
              be generated to the device (a kit serial and a password). You
              normally create one kit per physical device.
            </p>
            <RtkApiForm
              idPrefix="createKitForm"
              schema={schema}
              uiSchema={uiSchema}
              send={async (data) => {
                const { coordinate, ...rest } = data;
                let newKit;
                if (typeof coordinate === "undefined") {
                  newKit = {
                    latitude: null,
                    longitude: null,
                    ...rest,
                  };
                } else {
                  newKit = {
                    latitude: coordinate.latitude,
                    longitude: coordinate.longitude,
                    ...rest,
                  };
                }
                return await createKit(newKit);
              }}
              onResponse={onResponse}
              submitLabel={t("createKit.create")}
            />
          </>
        )}
      </article>
    </>
  );
}

export default withAuthentication()(CreateKit);
