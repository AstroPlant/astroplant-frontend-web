import React from "react";
import { Switch, Route, RouteComponentProps } from "react-router";
import { Container, Button, Input, Divider } from "semantic-ui-react";
import { KitState } from "modules/kit/reducer";

import { KitRpcApi } from "astroplant-api";
import { AuthConfiguration } from "utils/api";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params> & {
  kit: KitState;
};

type State = {
  versionRequesting: boolean;
  versionResponse: string | null;
  uptimeRequesting: boolean;
  uptimeResponse: string | null;
};

export default class KitRpc extends React.Component<Props, State> {
  state: State = {
    versionRequesting: false,
    versionResponse: null,
    uptimeRequesting: false,
    uptimeResponse: null
  };

  async versionRequest() {
    this.setState({ versionRequesting: true, versionResponse: null });
    const { kit } = this.props;

    try {
      const api = new KitRpcApi(AuthConfiguration.Instance);
      const versionResponse = await api
        .version({
          kitSerial: kit.details.serial
        })
        .toPromise();
      this.setState({ versionResponse });
    } finally {
      this.setState({ versionRequesting: false });
    }
  }

  async uptimeRequest() {
    this.setState({ uptimeRequesting: true, uptimeResponse: null });
    const { kit } = this.props;

    try {
      const api = new KitRpcApi(AuthConfiguration.Instance);
      const uptimeResponse = await api
        .uptime({
          kitSerial: kit.details.serial
        })
        .toPromise();
      this.setState({ uptimeResponse: `${uptimeResponse} seconds` });
    } finally {
      this.setState({ uptimeRequesting: false });
    }
  }

  render() {
    const { kit } = this.props;

    return (
      <Container text>
        <Button
          onClick={() => this.versionRequest()}
          loading={this.state.versionRequesting}
          disabled={this.state.versionRequesting}
          primary
        >
          Query kit version
        </Button>
        <Input
          readOnly
          value={this.state.versionResponse || ""}
          placeholder="kit response"
        />
        <Divider />
        <Button
          onClick={() => this.uptimeRequest()}
          loading={this.state.uptimeRequesting}
          disabled={this.state.uptimeRequesting}
          primary
        >
          Query kit uptime
        </Button>
        <Input
          readOnly
          value={this.state.uptimeResponse || ""}
          placeholder="kit response"
        />
      </Container>
    );
  }
}
