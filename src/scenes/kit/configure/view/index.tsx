import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Switch, Route, RouteComponentProps } from "react-router";
import { withTranslation, WithTranslation } from "react-i18next";
import { compose } from "recompose";

import { Container, Segment, Header, Divider } from "semantic-ui-react";
import { KitState } from "modules/kit/reducer";

import { JSONSchema6 } from "json-schema";
import ApiForm from "Components/ApiForm";

import { withOption, WithValue } from "Components/OptionGuard";
import { propsMap } from "Components/PropsMap";

import { KitsApi, KitConfigurationWithPeripherals } from "astroplant-api";
import { AuthConfiguration } from "utils/api";
import Option from "utils/option";

import Description from "./components/Description";
import ActivateDeactivate from "./components/ActivateDeactivate";
import Peripherals from "./components/Peripherals";

type Params = { configurationId: string };

export type Props = RouteComponentProps<Params> & { kit: KitState };

type InternalProps = Props &
  WithTranslation &
  WithValue<KitConfigurationWithPeripherals>;

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
    const { kit, value: configuration, t } = this.props;
    const { path, url } = this.props.match;

    return (
      <Container text>
        <Segment raised>
          <Header>Description</Header>
          <Description kit={kit} configuration={configuration} />
        </Segment>
        <Container textAlign="right">
          <ActivateDeactivate kit={kit} configuration={configuration} />
        </Container>
        <Divider />
        <Container>
          <Header>Peripherals</Header>
          <Peripherals kit={kit} configuration={configuration} />
        </Container>
      </Container>
    );
  }
}

const map = (props: Props) => {
  const { configurationId } = props.match.params;
  const { kit } = props;

  return {
    ...props,
    option: Option.from(kit.configurations[configurationId])
  };
};

export default compose<InternalProps, Props>(
  propsMap(map),
  withTranslation(),
  withOption(() => <div>Still loading, or configuration not found</div>)
)(ViewConfiguration);
