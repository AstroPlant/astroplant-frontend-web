import React, { useContext } from "react";
import { RouteComponentProps, Switch, Route } from "react-router";
import { NavLink } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container, Tab } from "semantic-ui-react";
import { KitState } from "modules/kit/reducer";

import RawMeasurements from "./components/RawMeasurements";
import AggregateMeasurements from "./components/AggregateMeasurements";
import Media from "./components/Media";
import { ConfigurationsContext } from "../contexts";

type Params = { kitSerial: string };

export type Props = WithTranslation &
  RouteComponentProps<Params> & {
    kitState: KitState;
  };

function KitOverview(props: Props) {
  const baseUrl = props.match.url;
  const { kitState } = props;

  const configurations = useContext(ConfigurationsContext);
  let activeConfiguration =
    Object.values(configurations).find((conf) => conf.active) ?? null;

  if (
    activeConfiguration === null ||
    Object.values(configurations).length === 0
  ) {
    return (
      <Container text>
        <div>
          <p>
            {activeConfiguration === null
              ? "This kit has no active configuration."
              : "This kit has no configurations yet."}
          </p>
          <p>
            For help on how to configure your kit you can read the documentation{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href="https://docs.astroplant.io/astroplant-kit-setup/registering-and-configuring-a-kit"
            >
              here
            </a>
          </p>
        </div>
      </Container>
    );
  } else {
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
          <>
            <Tab panes={panes} renderActiveOnly={false} activeIndex={-1} />
          </>
        </Switch>
      </Container>
    );
  }
}

export default withTranslation()(KitOverview);
