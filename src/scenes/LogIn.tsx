import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container } from "semantic-ui-react";
import { JSONSchema6 } from "json-schema";
import ApiForm from "Components/ApiForm";
import { AuthenticationTokens } from "astroplant-api";

import {
  setRememberMe,
  setRefreshToken,
  setAccessToken
} from "../modules/auth/actions";

import HeadTitle from "../Components/HeadTitle";

import { AuthenticateApi } from "astroplant-api";

const LogInForm = ApiForm<any, AuthenticationTokens>();

type State = {
  rememberMe: boolean;
};

type Props = WithTranslation &
  RouteComponentProps & {
    setRememberMe: (remember: boolean) => void;
    setRefreshToken: (token: string) => void;
    setAccessToken: (token: string) => void;
  };

class LogInPage extends Component<Props, State> {
  state: State = {
    rememberMe: false
  };

  send = (data: any) => {
    this.setState({ rememberMe: data.rememberMe });
    const api = new AuthenticateApi();
    return api.authenticateByCredentials({
      authUser: { username: data.username, password: data.password }
    });
  }

  onResponse = (response: AuthenticationTokens) => {
    this.props.setRememberMe(this.state.rememberMe);
    this.props.setRefreshToken(response.refreshToken);
    this.props.setAccessToken(response.accessToken);
    this.props.history.push("/me");
  }

  render() {
    const { t } = this.props;

    const schema: JSONSchema6 = {
      type: "object",
      required: ["username", "password"],
      properties: {
        username: { type: "string", title: t("common.username") },
        password: { type: "string", title: t("common.password") },
        rememberMe: {
          type: "boolean",
          title: t("logIn.rememberMe")
        }
      }
    };

    const uiSchema = {
      password: {
        "ui:widget": "password"
      }
    };

    return (
      <>
        <HeadTitle main="Log in" />
        <Container text style={{ marginTop: "1em" }} width={2}>
          <LogInForm
            schema={schema}
            uiSchema={uiSchema}
            send={this.send}
            onResponse={this.onResponse}
            submitLabel={t("logIn.logIn")}
          />
        </Container>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setRememberMe,
      setRefreshToken,
      setAccessToken
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(withTranslation()(withRouter(LogInPage)));
