import React, { useContext } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

import { Container, Segment, Header, Divider } from "semantic-ui-react";

import { KitContext, ConfigurationsContext } from "~/scenes/kit/contexts";
import Description from "./components/Description";
import Rules from "./components/Rules";
import ActivateDeactivate from "./components/ActivateDeactivate";
import Peripherals from "./components/Peripherals";

export default function ViewConfiguration() {
  const { t } = useTranslation();
  const { configurationId } = useParams<{ configurationId: string }>();

  const kit = useContext(KitContext);
  const configurations = useContext(ConfigurationsContext);

  const configuration = configurations[configurationId];

  if (configuration === undefined) {
    return <div>Configuration not found.</div>;
  } else {
    return (
      <Container>
        <Segment raised>
          <Header>Description</Header>
          <Description
            kit={kit}
            configuration={configuration}
            readOnly={
              /* The description can be changed as long as the person viewing
               * this kit has the EditConfiguration permission.
               * TODO: handle permissions on the frontend */
              false
            }
          />
        </Segment>
        <Container textAlign="right">
          <ActivateDeactivate kit={kit} configuration={configuration} />
        </Container>
        <Divider />
        <Container>
          <Header>{t("control.header")}</Header>
          <Rules
            kit={kit}
            configuration={configuration}
            readOnly={!configuration.neverUsed}
          />
        </Container>
        <Divider />
        <Container>
          <Header>Peripherals</Header>
          <Peripherals
            kit={kit}
            configuration={configuration}
            readOnly={!configuration.neverUsed}
          />
        </Container>
      </Container>
    );
  }
}
