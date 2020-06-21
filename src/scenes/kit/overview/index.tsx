import React from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import { NavLink } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container, Loader, Tab } from "semantic-ui-react";
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
  const baseUrl = props.match.url;
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
        menuItem: {
          as: NavLink,
          content: "Measurements",
          to: `${baseUrl}`,
          exact: true,
          key: "measurements",
        },
        pane: (
          <Route
            key={"measurements-pane"}
            path={`${baseUrl}`}
            exact
            render={() => (
              <Tab.Pane>
                <>
                  <h2>Now</h2>
                  <RawMeasurements kitState={kitState} />
                  <h2>Past</h2>
                  <AggregateMeasurements kitState={kitState} />
                </>
              </Tab.Pane>
            )}
          />
        ),
      },
      {
        menuItem: {
          as: NavLink,
          content: "Media",
          to: `${baseUrl}/media`,
          exact: true,
          key: "media",
        },
        pane: (
          <Route
            key={"media-pane"}
            path={`${baseUrl}/media`}
            render={() => (
              <Tab.Pane>
                <Media kitState={kitState} />
              </Tab.Pane>
            )}
          />
        ),
      },
    ];

    return (
      <Container>
        <Switch>
          <Tab panes={panes} renderActiveOnly={false} activeIndex={-1} />
        </Switch>
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
