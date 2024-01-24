import React from "react";
import { Link } from "react-router-dom";
import { withTranslation, WithTranslation, Trans } from "react-i18next";
import { Container, Header, Segment } from "semantic-ui-react";

import HeadTitle from "../Components/HeadTitle";

type Props = WithTranslation & any;

function MustBeLoggedIn(props: Props) {
  const { t } = props;

  return (
    <>
      <HeadTitle main="Oh no!" />
      <Container text style={{ marginTop: "1em" }}>
        <Segment>
          <Header>{t("mustBeLoggedIn.content.title")}</Header>
          <p>
            <Trans i18nKey="mustBeLoggedIn.content.body">
              Please <Link to="/log-in">log in</Link> to view this page.
            </Trans>
          </p>
        </Segment>
      </Container>
    </>
  );
}

export default withTranslation()(MustBeLoggedIn);
