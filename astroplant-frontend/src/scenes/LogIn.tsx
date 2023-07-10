import React, { useCallback, useState } from "react";
import { useHistory } from "react-router";
import { useTranslation } from "react-i18next";
import { Container } from "semantic-ui-react";
import { JSONSchema7 } from "json-schema";

import {
  setRememberMe,
  setRefreshToken,
  setAccessToken,
} from "~/modules/auth/actions";

import HeadTitle from "~/Components/HeadTitle";
import ApiForm from "~/Components/ApiForm";
import { useAppDispatch } from "~/hooks";
import { api, schemas, Response } from "~/api";

const LogInForm = ApiForm<any, Response<schemas["AuthenticationTokens"]>>();

export default function LogInPage() {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  const history = useHistory();
  const [rememberMeState, setRememberMeState] = useState(false);

  const send = useCallback((data: any) => {
    setRememberMeState(data.rememberMe);
    return api.authenticateByCredentials({
      authUser: { username: data.username, password: data.password },
    });
  }, []);

  const onResponse = useCallback(
    (response: Response<schemas["AuthenticationTokens"]>) => {
      dispatch(setRememberMe(rememberMeState));
      dispatch(setRefreshToken(response.data.refreshToken));
      dispatch(setAccessToken(response.data.accessToken));
      history.push("/me");
    },
    [dispatch, history, rememberMeState]
  );

  const schema: JSONSchema7 = {
    type: "object",
    required: ["username", "password"],
    properties: {
      username: { type: "string", title: t("common.username") },
      password: { type: "string", title: t("common.password") },
      rememberMe: {
        type: "boolean",
        title: t("logIn.rememberMe"),
      },
    },
  };

  const uiSchema = {
    password: {
      "ui:widget": "password",
    },
  };

  return (
    <>
      <HeadTitle main="Log in" />
      <Container text style={{ marginTop: "1em" }} width={2}>
        <LogInForm
          schema={schema}
          uiSchema={uiSchema}
          send={send}
          onResponse={onResponse}
          submitLabel={t("logIn.logIn")}
        />
      </Container>
    </>
  );
}
