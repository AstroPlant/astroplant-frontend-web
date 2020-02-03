import React from "react";
import { RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from "react-i18next";
import { compose } from "recompose";

import { Container, Segment, Header, Divider } from "semantic-ui-react";
import { KitState, KitConfigurationState } from "modules/kit/reducer";

import { withOption, WithValue } from "Components/OptionGuard";
import { propsMap } from "Components/PropsMap";

import Option from "utils/option";

import Description from "./components/Description";
import Rules from "./components/Rules";
import ActivateDeactivate from "./components/ActivateDeactivate";
import Peripherals from "./components/Peripherals";

type Params = { configurationId: string };

export type Props = RouteComponentProps<Params> & { kitState: KitState };

type InternalProps = Props & WithTranslation & WithValue<KitConfigurationState>;

type State = {
  done: boolean;
  result: any;
};

class ViewConfiguration extends React.Component<InternalProps, State> {
  state = {
    done: false,
    result: null
  };

  render() {
    const { kitState, value: configuration, t } = this.props;

    return (
      <Container text>
        <Segment raised>
          <Header>Description</Header>
          <Description kit={kitState.details.unwrap()} configuration={configuration} />
        </Segment>
        <Container textAlign="right">
          <ActivateDeactivate kit={kitState.details.unwrap()} configuration={configuration} />
        </Container>
        <Divider />
        <Container>
          <Header>{t("rules.header")}</Header>
          <Rules kit={kitState.details.unwrap()} configuration={configuration} />
        </Container>
        <Divider />
        <Container>
          <Header>Peripherals</Header>
          <Peripherals kit={kitState.details.unwrap()} configuration={configuration} />
        </Container>
      </Container>
    );
  }
}

const map = (props: Props) => {
  const { configurationId } = props.match.params;
  const { kitState } = props;

  return {
    ...props,
    option: Option.from(kitState.configurations[configurationId])
  };
};

export default compose<InternalProps, Props>(
  propsMap(map),
  withTranslation(),
  withOption(() => <div>Still loading, or configuration not found</div>)
)(ViewConfiguration);
