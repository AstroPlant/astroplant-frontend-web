import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Container, Divider, Grid, Segment } from "semantic-ui-react";

import HeadTitle from "./HeadTitle";
import InfoRecuadro from "./InfoRecuadro";

class Home extends Component {
  render() {
    const { t } = this.props;

    return (
      <>
        <HeadTitle main={t("home.header")} secondary={t("home.subheader")} />
        <Container text style={{ marginTop: "1em" }}>
          <h2>{t("home.content.title")}</h2>

          <p>{t("home.content.p1")}</p>
          <p>{t("home.content.p2")}</p>
          <p>{t("home.content.p3")}</p>
        </Container>

        <Divider />

        <Container>
          <Segment placeholder>
            <Grid columns={3} stackable textAlign="center">
              <Grid.Row divided="vertically" verticalAlign="middle">
                <Grid.Column>
                  <InfoRecuadro
                    icon="map marker alternate"
                    head_text={t("home.buttons.see.head")}
                    p_text={t("home.buttons.see.body")}
                    button_text={t("home.buttons.see.button")}
                    ruta="home"
                  />
                </Grid.Column>
                <Grid.Column>
                  <InfoRecuadro
                    icon="pagelines"
                    head_text={t("home.buttons.learn.head")}
                    p_text={t("home.buttons.learn.body")}
                    button_text={t("home.buttons.learn.button")}
                    ruta="/home"
                  />
                </Grid.Column>
                <Grid.Column>
                  <InfoRecuadro
                    icon="dashboard"
                    head_text={t("home.buttons.analyze.head")}
                    p_text={t("home.buttons.analyze.body")}
                    button_text={t("home.buttons.analyze.button")}
                    ruta="/analyze"
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Container>
      </>
    );
  }
}

export default withTranslation()(Home);
