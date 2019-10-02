import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Container,
  Divider,
  Grid,
  Segment,
  Header,
  Form,
  Transition,
  Icon,
  Card,
  Input
} from "semantic-ui-react";
import { kitCreated } from "../modules/me/actions";

import { JSONSchema6 } from "json-schema";
import RjsfForm from "../rjsf-theme-semantic-ui";

import { RootState } from "types";

import { KitsApi, Configuration } from "astroplant-api";
import { AuthConfiguration } from "ApiAuth";
import HttpStatus from "http-status-codes";
import { PDInvalidParameters, InvalidParametersFormErrors } from "../problems";

import {
  withAuthentication,
  WithAuthentication
} from "../Components/AuthenticatedGuard";
import HeadTitle from "../Components/HeadTitle";

type Props = WithTranslation &
  WithAuthentication & {
    authenticationToken: string | null;
    kitCreated: () => any;
  };

type State = {
  submitting: boolean;
  done: boolean;
  formEpoch: number; // Hacky var to reset form errors on submission.
  formData: any;
  additionalFormErrors: InvalidParametersFormErrors;
  result: { kitSerial: string | null; password: string | null };
};
function validate(formData: any, errors: any) {
  return errors;
}

class CreateKit extends Component<Props, State> {
  state = {
    submitting: false,
    done: false,
    formEpoch: 0,
    formData: {},
    additionalFormErrors: {},
    result: {
      kitSerial: null,
      password: null
    }
  };

  async submit(formData: any) {
    this.setState(state => {
      return {
        submitting: true,
        formEpoch: state.formEpoch + 1,
        formData,
        additionalFormErrors: {},
        result: {
          kitSerial: null,
          password: null
        }
      };
    });

    const api = new KitsApi(AuthConfiguration.Instance);
    console.warn(formData);

    try {
      const result = await api.createKit(formData).toPromise();

      this.props.kitCreated();
      this.setState({ done: true, result: result });
    } catch (e) {
      console.warn("error when attempting to create account", e, e.response);
      const formErrors = PDInvalidParameters.toFormErrors(
        this.props.t,
        e.response
      );
      if (formErrors !== null) {
        console.warn("form errors", formErrors);
        this.setState({ additionalFormErrors: formErrors });
      }
    } finally {
      this.setState({ submitting: false });
    }
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
        latitude: { type: "number", title: t("common.latitude") },
        longitude: { type: "number", title: t("common.longitude") },
        privacyPublicDashboard: {
          type: "boolean",
          default: false,
          title: t("kit.privacyPublicDashboard")
        },
        privacyShowOnMap: {
          type: "boolean",
          default: false,
          title: t("kit.privacyShowOnMap")
        }
      }
    };

    const uiSchema = {};

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
                {/* TODO: Waiting for
              https://github.com/rjsf-team/react-jsonschema-form/pull/1444
              to be merged
              // @ts-ignore */}
                <RjsfForm
                  key={this.state.formEpoch}
                  schema={schema}
                  uiSchema={uiSchema}
                  validate={validate}
                  onSubmit={({ formData }) => this.submit(formData)}
                  formData={this.state.formData}
                  disabled={this.state.submitting}
                  extraErrors={this.state.additionalFormErrors}
                >
                  <Form.Button
                    type="submit"
                    primary
                    disabled={this.state.submitting}
                    loading={this.state.submitting}
                  >
                    {t("createKit.create")}
                  </Form.Button>
                </RjsfForm>
              </>
            )}
          </Segment>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  authenticationToken: state.auth.authenticationToken
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
