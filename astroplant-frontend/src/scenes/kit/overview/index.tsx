import React, { useContext } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container } from "semantic-ui-react";
import { KitState } from "modules/kit/reducer";

import RawMeasurements from "./components/RawMeasurements";
import AggregateMeasurements from "./components/AggregateMeasurements";
import { ConfigurationsContext } from "../contexts";

export type Props = WithTranslation & {
  kitState: KitState;
};

function KitOverview(props: Props) {
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
    return (
      <>
        <h2>Now</h2>
        <RawMeasurements kitState={kitState} />
        <h2>Past</h2>
        <AggregateMeasurements kitState={kitState} />
      </>
    );
  }
}

export default withTranslation()(KitOverview);
