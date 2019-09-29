import React, { Component } from "react";
import { withRouter, RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Container,
  Form,
  Header,
  Icon,
  Transition
} from "semantic-ui-react";
import { JSONSchema6 } from "json-schema";
import RjsfForm from "../rjsf-theme-semantic-ui";

import { setRefreshToken, setAuthenticationToken } from "../modules/auth/actions";

import HeadTitle from "./HeadTitle";

import { AuthenticateApi } from "../api";
import HttpStatus from "http-status-codes";
import { PDInvalidParameters, InvalidParametersFormErrors } from "../problems";

type State = {
  submitting: boolean;
  formEpoch: number; // Hacky var to reset form errors on submission.
  formData: any;
  additionalFormErrors: InvalidParametersFormErrors;
};

type Props = WithTranslation & RouteComponentProps & {
  setRefreshToken: (token: string) => void;
  setAuthenticationToken: (token: string) => void;
};

class LogInPage extends Component<Props, State> {
  state = {
    submitting: false,
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

    const api = new AuthenticateApi();
    const { username, password } = formData;

    try {
      const result = await api.authenticateByCredentials({
        username,
        password
      });
      console.log(result);
      if (result.status === HttpStatus.OK) {
        this.props.setRefreshToken(result.data.refreshToken);
        this.props.setAuthenticationToken(result.data.authenticationToken);
        this.props.history.push("/me");
      }
    } catch (e) {
      console.warn("error when attempting to log in", e, e.response);
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
          {/* TODO: Waiting for
                    https://github.com/rjsf-team/react-jsonschema-form/pull/1444
                    to be merged
                    // @ts-ignore */}
          <RjsfForm
            key={this.state.formEpoch}
            schema={schema}
            uiSchema={uiSchema}
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
              {t("logIn.logIn")}
            </Form.Button>
          </RjsfForm>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      setRefreshToken,
      setAuthenticationToken
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(withRouter(LogInPage)));
