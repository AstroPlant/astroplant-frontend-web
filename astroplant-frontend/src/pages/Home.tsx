import React, { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container } from "semantic-ui-react";

import HeadTitle from "../Components/HeadTitle";

class Home extends Component<WithTranslation> {
  render() {
    const { t } = this.props;

    return (
      <>
        <HeadTitle main={t("home.header")} secondary={t("home.subheader")} />
        <Container text style={{ marginTop: "1em" }}>
          <h2>{t("home.content.title")}</h2>

          <p>{t("home.content.body1")}</p>
          <p>{t("home.content.body2")}</p>
          <p>{t("home.content.body3")}</p>
        </Container>

        {/*
        <Divider />

        <Container>
          <Segment placeholder>
            <Grid columns={3} stackable textAlign="center">
              <Grid.Row divided verticalAlign="middle">
                <Grid.Column>
                  <InfoBox
                    icon="map marker alternate"
                    header={t("home.buttons.see.header")}
                    body={t("home.buttons.see.body")}
                    button={t("home.buttons.see.button")}
                    route="/home"
                  />
                </Grid.Column>
                <Grid.Column>
                  <InfoBox
                    icon="pagelines"
                    header={t("home.buttons.learn.header")}
                    body={t("home.buttons.learn.body")}
                    button={t("home.buttons.learn.button")}
                    route="/home"
                  />
                </Grid.Column>
                <Grid.Column>
                  <InfoBox
                    icon="dashboard"
                    header={t("home.buttons.analyze.header")}
                    body={t("home.buttons.analyze.body")}
                    button={t("home.buttons.analyze.button")}
                    route="/analyze"
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Container>
       */}
      </>
    );
  }
}

export default withTranslation()(Home);
