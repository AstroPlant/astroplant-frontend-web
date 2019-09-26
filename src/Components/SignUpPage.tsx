import React, { Component } from "react";
import { Link } from "react-router-dom";
import HeadTitle from "./HeadTitle";
import { Container, Form, Segment } from "semantic-ui-react";
import RjsfForm from "../rjsf-theme-semantic-ui";
import { JSONSchema6, JSONSchema6Type } from "json-schema";

import { UserApi } from "../api";

const schema: JSONSchema6 = {
  type: "object",
  title: "Account details",
  required: ["username", "password", "passwordRepeat", "emailAddress"],
  properties: {
    username: { type: "string", title: "Username" },
    password: { type: "string", title: "Password" },
    passwordRepeat: { type: "string", title: "Password repeat" },
    emailAddress: { type: "string", title: "Email address" },
    termsOfService: {
      type: "boolean",
      title: "I have read and agree to the Terms of Service"
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

type State = {
  username: string;
  emailAddress: string;
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

class SignUpPage extends Component<{}, State> {
  async submit(formData: any) {
    console.warn("asd", formData);

    const api = new UserApi();
    console.warn(await api.createUser({
      username: formData.username,
      password: formData.password,
      emailAddress: formData.emailAddress
    }));
  }

  render() {
    return (
      <div>
        <HeadTitle
          main="Create an account"
          secondary="Create an account to connect to the AstroPlant world."
        />
        <Container text style={{ marginTop: "1em" }}>
          <Segment piled padded>
            <RjsfForm
              schema={schema}
              uiSchema={uiSchema}
              validate={validate}
              onSubmit={({ formData }) => this.submit(formData)}
            >
              <Form.Button type="submit" primary>
                Submit
              </Form.Button>
            </RjsfForm>
          </Segment>
        </Container>
      </div>
    );
  }
}

export default SignUpPage;
