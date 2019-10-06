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
  setRefreshToken,
  setAuthenticationToken
} from "../modules/auth/actions";

import HeadTitle from "../Components/HeadTitle";

import { AuthenticateApi } from "astroplant-api";

type Props = WithTranslation &
  RouteComponentProps & {
    setRefreshToken: (token: string) => void;
    setAuthenticationToken: (token: string) => void;
  };

class LogInPage extends Component<Props> {
  send(data: any) {
    const api = new AuthenticateApi();
    return api.authenticateByCredentials({ authUser: data });
  }

  onResponse(response: AuthenticationTokens) {
    this.props.setRefreshToken(response.refreshToken);
    this.props.setAuthenticationToken(response.authenticationToken);
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

    const LogInForm = ApiForm<any, AuthenticationTokens>();

    return (
      <>
        <HeadTitle main="Log in" />
        <Container text style={{ marginTop: "1em" }} width={2}>
          <LogInForm
            schema={schema}
            uiSchema={uiSchema}
            send={this.send}
            onResponse={this.onResponse.bind(this)}
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
      setRefreshToken,
      setAuthenticationToken
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(withTranslation()(withRouter(LogInPage)));
