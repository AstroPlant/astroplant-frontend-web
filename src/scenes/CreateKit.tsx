import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Container,
  Segment,
  Header,
  Transition,
  Icon,
  Card,
  Input
} from "semantic-ui-react";
import { kitCreated } from "../modules/me/actions";

import { JSONSchema6 } from "json-schema";
import ApiForm from "Components/ApiForm";

import { RootState } from "types";

import { KitsApi } from "astroplant-api";
import { AuthConfiguration } from "utils/api";

import {
  withAuthentication,
  WithAuthentication
} from "../Components/AuthenticatedGuard";
import HeadTitle from "../Components/HeadTitle";

type Props = WithTranslation &
  WithAuthentication & {
    accessToken: string | null;
    kitCreated: () => any;
  };

type State = {
  done: boolean;
  result: { kitSerial: string | null; password: string | null };
};
function validate(formData: any, errors: any) {
  return errors;
}

const CreateKitForm = ApiForm<any, { kitSerial: string; password: string }>();

class CreateKit extends Component<Props, State> {
  state = {
    done: false,
    result: {
      kitSerial: null,
      password: null
    }
  };

  onResponse(response: { kitSerial: string; password: string }) {
    this.props.kitCreated();
    this.setState({ done: true, result: response });
  }

  transform(formData: any) {
    const { coordinate, ...rest } = formData;
    if (typeof coordinate === "undefined") {
      return {
        latitude: null,
        longitude: null,
        ...rest
      };
    } else {
      return {
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        ...rest
      };
    }
  }

  send(formData: any) {
    const api = new KitsApi(AuthConfiguration.Instance);
    return api.createKit({ newKit: formData });
  }

  render() {
    const { t } = this.props;

    const schema: JSONSchema6 = {
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
            longitude: { type: "number", title: t("common.longitude") }
          }
        },
        privacyPublicDashboard: {
          type: "boolean",
          default: true,
          title: t("kit.privacyPublicDashboard")
        },
        privacyShowOnMap: {
          type: "boolean",
          default: true,
          title: t("kit.privacyShowOnMap")
        }
      }
    };

    const uiSchema = {
      description: {
        "ui:widget": "textarea"
      },
      coordinate: {
        "ui:field": "Coordinate"
      }
    };

    return (
      <>
        <HeadTitle main={t("createKit.header")} />
        <Container text style={{ marginTop: "1em" }}>
          <Segment piled padded>
            {this.state.done ? (
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
                  <Card color="orange" centered raised fluid>
                    <Card.Content>
                      <Card.Header>Kit password</Card.Header>
                      <Card.Description>
                        <Input
                          fluid
                          icon={<Icon name="lock" inverted circular link />}
                          value={this.state.result.password || ""}
                          readOnly
                        />
                      </Card.Description>
                    </Card.Content>
                  </Card>
                  <p>
                    <Link to={`/kit/${this.state.result.kitSerial || ""}`}>
                      Click here
                    </Link>{" "}
                    to go to its dashboard.
                  </p>
                </Container>
              </>
            ) : (
              <>
                <CreateKitForm
                  schema={schema}
                  uiSchema={uiSchema}
                  validate={validate}
                  transform={this.transform.bind(this)}
                  send={this.send.bind(this)}
                  onResponse={this.onResponse.bind(this)}
                  submitLabel={t("createKit.create")}
                />
              </>
            )}
          </Segment>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  accessToken: state.auth.accessToken
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      kitCreated
    },
    dispatch
  );

export default withAuthentication()(
  withTranslation()(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(CreateKit)
  )
);
