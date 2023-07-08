import React, { useContext } from "react";
import { RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from "react-i18next";
import compose from "~/utils/compose";

import { Container, Segment, Header, Divider } from "semantic-ui-react";
import { KitConfigurationState } from "~/modules/kit/reducer";

import Option from "~/utils/option";

import { KitContext, ConfigurationsContext } from "../../contexts";

import Description from "./components/Description";
import Rules from "./components/Rules";
import ActivateDeactivate from "./components/ActivateDeactivate";
import Peripherals from "./components/Peripherals";

type Params = { configurationId: string };

export type Props = RouteComponentProps<Params>;
type InternalProps = Props & WithTranslation;

function ViewConfiguration(props: InternalProps) {
  const { t } = props;
  const { configurationId } = props.match.params;

  const kit = useContext(KitContext);
  const configurations = useContext(ConfigurationsContext);

  const configuration: Option<KitConfigurationState> = Option.from(configurations![configurationId]);

  if (configuration.isNone()) {
    return <div>Configuration not found.</div>;
  } else {
    return (
      <Container>
        <Segment raised>
          <Header>Description</Header>
          <Description kit={kit} configuration={configuration.unwrap()} />
        </Segment>
        <Container textAlign="right">
          <ActivateDeactivate
            kit={kit}
            configuration={configuration.unwrap()}
          />
        </Container>
        <Divider />
        <Container>
          <Header>{t("control.header")}</Header>
          <Rules kit={kit} configuration={configuration.unwrap()} />
        </Container>
        <Divider />
        <Container>
          <Header>Peripherals</Header>
          <Peripherals kit={kit} configuration={configuration.unwrap()} />
        </Container>
      </Container>
    );
  }
}

export default compose<InternalProps, Props>(withTranslation())(
  ViewConfiguration
);
