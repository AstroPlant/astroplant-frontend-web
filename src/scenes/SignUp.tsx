import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header, Icon, Transition } from "semantic-ui-react";
import { JSONSchema7 } from "json-schema";

import ApiForm from "~/Components/ApiForm";
import HeadTitle from "~/Components/HeadTitle";
import { api } from "~/api";

import commonStyle from "~/Common.module.css";

const SignUpForm = ApiForm();

export default function SignUpPage() {
  const { t } = useTranslation();
  const [done, setDone] = useState(false);

  const validate = (formData: any, errors: any) => {
    if (formData.password !== formData.passwordRepeat) {
      errors.passwordRepeat.addError("passwords do not match");
    }

    if (!formData.termsOfService) {
      errors.termsOfService.addError("you must agree to the Terms of Service");
    }
    return errors;
  };

  const onResponse = () => {
    setDone(true);
  };

  const send = (data: any) => {
    return api.createUser({
      newUser: {
        username: data.username,
        password: data.password,
        emailAddress: data.emailAddress,
      },
    });
  };

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
        title: t("signUp.readAgreeTermsOfService"),
      },
    },
  };

  const uiSchema = {
    password: {
      "ui:widget": "password",
    },
    passwordRepeat: {
      "ui:widget": "password",
    },
    emailAddress: {
      // e-mail widget seems to be missing in @rjsf/semantic-ui
      // "ui:widget": "email"
    },
  };

  return (
    <>
      <HeadTitle
        main="Create an account"
        secondary="Create an account to connect to the AstroPlant world."
      />
      <article
        className={commonStyle.containerRegular}
        style={{ marginTop: "1rem" }}
      >
        {done ? (
          <>
            <Header size="huge" icon textAlign="center">
              <Transition animation="drop" duration={450} transitionOnMount>
                <Icon name="check" circular />
              </Transition>
              <Header.Content>Success!</Header.Content>
            </Header>
            <p style={{ textAlign: "center" }}>
              Your account has been created.{" "}
              <Link to="/log-in">You can now log in.</Link>
            </p>
          </>
        ) : (
          <SignUpForm
            idPrefix="signUpForm"
            schema={schema}
            uiSchema={uiSchema}
            validate={validate}
            send={send}
            onResponse={onResponse}
            submitLabel={t("signUp.createAccount")}
          />
        )}
      </article>
    </>
  );
}
