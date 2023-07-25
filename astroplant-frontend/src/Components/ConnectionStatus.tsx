import React from "react";
import { useTranslation } from "react-i18next";
import { Container, Message } from "semantic-ui-react";
import { useAppSelector } from "~/hooks";

export default function ConnectionStatus() {
  const { t } = useTranslation();
  const apiConnectionFailed = useAppSelector(
    (state) => state.generic.apiConnectionFailed,
  );

  if (apiConnectionFailed) {
    return (
      <div style={{ position: "fixed", top: "3em", left: "3em" }}>
        <Container text>
          <Message
            error={true}
            header={t("permanentConnectionIssue.title")}
            content={t("permanentConnectionIssue.body")}
          />
        </Container>
      </div>
    );
  } else {
    return <></>;
  }
}
