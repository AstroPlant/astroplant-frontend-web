import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Container,
  Segment,
  Header,
  Icon,
  Transition
} from "semantic-ui-react";
import { JSONSchema7 } from "json-schema";
import ApiForm from "~/Components/ApiForm";

import HeadTitle from "~/Components/HeadTitle";

import { UsersApi } from "astroplant-api";

type State = {
  done: boolean;
};

const SignUpForm = ApiForm();

class SignUpPage extends Component<WithTranslation, State> {
  state = {
    done: false
  };

  validate(formData: any, errors: any) {
    if (formData.password !== formData.passwordRepeat) {
      errors.passwordRepeat.addError("passwords do not match");
    }

    if (!formData.termsOfService) {
      errors.termsOfService.addError("you must agree to the Terms of Service");
    }
    return errors;
  }

  onResponse() {
    this.setState({ done: true });
  }

  send(data: any) {
    const api = new UsersApi();
    return api.createUser({
      newUser: data
    });
  }

  render() {
    const { t } = this.props;

    const schema: JSONSchema7 = {
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
      <>
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
              <SignUpForm
                schema={schema}
                uiSchema={uiSchema}
                validate={this.validate}
                send={this.send}
                onResponse={this.onResponse.bind(this)}
                submitLabel={t("signUp.createAccount")}
              />
            )}
          </Segment>
        </Container>
      </>
    );
  }
}

export default withTranslation()(SignUpPage);
