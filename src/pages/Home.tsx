import React from "react";
import { Container } from "semantic-ui-react";

import HeadTitle from "../Components/HeadTitle";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      <HeadTitle main={t("home.header")} secondary={t("home.subheader")} />
      <Container text style={{ marginTop: "1em" }}>
        <h2>{t("home.content.title")}</h2>

        <p>{t("home.content.body1")}</p>
        <p>{t("home.content.body2")}</p>
        <p>{t("home.content.body3")}</p>
      </Container>
    </>
  );
}
