import React from "react";
import { useTranslation } from "react-i18next";

import { Container, Segment, Header, Divider } from "semantic-ui-react";

import Description from "./configure/Description";
import Rules from "./configure/Rules";
import ActivateDeactivate from "./configure/ActivateDeactivate";
import Peripherals from "./configure/Peripherals";
import { KitConfigurationState, KitState } from "~/modules/kit/reducer";

export type ConfigurationProps = {
  kit: KitState;
  configuration: KitConfigurationState;
};

export default function Configuration({
  kit,
  configuration,
}: ConfigurationProps) {
  const { t } = useTranslation();

  return (
    <Container>
      <Segment raised>
        <Header>Description</Header>
        <Description
          kit={kit.details!}
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
        <ActivateDeactivate kit={kit.details!} configuration={configuration} />
      </Container>
      <Divider />
      <Container>
        <Header>{t("control.header")}</Header>
        <Rules
          kit={kit.details!}
          configuration={configuration}
          readOnly={!configuration.neverUsed}
        />
      </Container>
      <Divider />
      <Container>
        <Header>Peripherals</Header>
        <Peripherals
          kit={kit.details!}
          configuration={configuration}
          readOnly={!configuration.neverUsed}
        />
      </Container>
    </Container>
  );
}
