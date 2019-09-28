import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
import HeadTitle from "./HeadTitle";
import {
  Container,
  Form,
  Segment,
  Header,
  Icon,
  Transition
} from "semantic-ui-react";
import RjsfForm from "../rjsf-theme-semantic-ui";
import { JSONSchema6 } from "json-schema";

import { UserApi } from "../api";
import HttpStatus from "http-status-codes";
import { PDInvalidParameters, InvalidParametersFormErrors } from "../problems";

type State = {
  submitting: boolean;
  done: boolean;
  formEpoch: number; // Hacky var to reset form errors on submission.
  formData: any;
  additionalFormErrors: InvalidParametersFormErrors;
};

function validate(formData: any, errors: any) {
  if (formData.password !== formData.passwordRepeat) {
    errors.passwordRepeat.addError("passwords do not match");
  }

  if (!formData.termsOfService) {
    errors.termsOfService.addError("you must agree to the Terms of Service");
  }
  return errors;
}

class SignUpPage extends Component<WithTranslation, State> {
  state = {
    submitting: false,
    done: false,
    formEpoch: 0,
    formData: {},
    additionalFormErrors: {}
  };

  async submit(formData: any) {
    this.setState(state => {
      return {
        submitting: true,
        formEpoch: state.formEpoch + 1,
        formData,
        additionalFormErrors: {}
      };
    });

    const api = new UserApi();

    try {
      const result = await api.createUser({
        username: formData.username,
        password: formData.password,
        emailAddress: formData.emailAddress
      });

      if (result.status === HttpStatus.CREATED) {
        this.setState({ done: true });
      }
    } catch (e) {
      console.warn("error when attempting to create account", e, e.response);
      const formErrors = PDInvalidParameters.toFormErrors(
        this.props.t,
        e.response.data
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
      title: "Account details",
      required: ["username", "password", "passwordRepeat", "emailAddress"],
      properties: {
        username: { type: "string", title: t("common.username") },
        password: { type: "string", title: t("common.password") },
        passwordRepeat: { type: "string", title: t("account.passwordRepeat") },
        emailAddress: { type: "string", title: t("common.emailAddress") },
        termsOfService: {
          type: "boolean",
          title: t("signUp.readAgreeTermsOfService")
        }
      }
    };

    const uiSchema = {
      password: {
        "ui:widget": "password"
      },
      passwordRepeat: {
        "ui:widget": "password"
      },
      emailAddress: {
        "ui:widget": "email"
      }
    };

    return (
      <div>
        <HeadTitle
          main="Create an account"
          secondary="Create an account to connect to the AstroPlant world."
        />
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
                    Your account has been created.{" "}
                    <Link to="/log-in">You can now log in.</Link>
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
                  onSubmit={({ formData }) => {
                    this.submit(formData);
                    return false;
                  }}
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
                    {t("signUp.createAccount")}
                  </Form.Button>
                </RjsfForm>
              </>
            )}
          </Segment>
        </Container>
      </div>
    );
  }
}

export default withTranslation()(SignUpPage);
