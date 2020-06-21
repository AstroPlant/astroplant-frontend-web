import React from "react";
import { RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container, Loader, Header, Tab } from "semantic-ui-react";
import { KitState } from "modules/kit/reducer";

import RawMeasurements from "./components/RawMeasurements";
import AggregateMeasurements from "./components/AggregateMeasurements";
import Media from "./components/Media";

type Params = { kitSerial: string };

export type Props = WithTranslation &
  RouteComponentProps<Params> & {
    kitState: KitState;
  };

function KitOverview(props: Props) {
  const { t, kitState } = props;
  let activeConfiguration = null;
  for (const configuration of Object.values(
    kitState.configurations.unwrapOr({})
  )) {
    if (configuration.active) {
      activeConfiguration = configuration;
    }
  }

  if (activeConfiguration !== null) {
    const panes = [
      {
        menuItem: "Measurements",
        render: () => (
          <Tab.Pane>
            <>
              <h2>Now</h2>
              <RawMeasurements kitState={kitState} />
              <h2>Past</h2>
              <AggregateMeasurements kitState={kitState} />
            </>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Media",
        render: () => (
          <Tab.Pane>
            <Media kitState={kitState} />
          </Tab.Pane>
        ),
      },
    ];

    return (
      <Container>
        <Tab panes={panes} />
      </Container>
    );
  } else if (kitState.configurations.isNone()) {
    return (
      <Container>
        <Loader active />
      </Container>
    );
  } else {
    return (
      <Container text>
        <div
          style={{
            fontWeight: "bolder",
            opacity: 0.6,
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          <h2>{t("kit.noActiveConfiguration")}</h2>
        </div>
      </Container>
    );
  }
}

export default withTranslation()(KitOverview);
