import React from "react";
import { RouteComponentProps } from "react-router";
import { Container, Button, Input, Divider } from "semantic-ui-react";

import { Kit, KitRpcApi } from "astroplant-api";
import { configuration, AuthConfiguration } from "utils/api";

import { KitRpcApi as MyKitRpcApi } from "api";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params> & {
  kit: Kit;
};

type State = {
  versionRequesting: boolean;
  versionResponse: string | null;
  uptimeRequesting: boolean;
  uptimeResponse: string | null;
  peripheralCommandRequesting: boolean;
  peripheralCommandResponse: any;
  peripheralCommandPeripheral: string;
  peripheralCommandCommand: string;
};

export default class KitRpc extends React.Component<Props, State> {
  state: State = {
    versionRequesting: false,
    versionResponse: null,
    uptimeRequesting: false,
    uptimeResponse: null,
    peripheralCommandRequesting: false,
    peripheralCommandResponse: null,
    peripheralCommandPeripheral: "",
    peripheralCommandCommand: "",
  };

  async versionRequest() {
    this.setState({ versionRequesting: true, versionResponse: null });
    const { kit } = this.props;

    try {
      const api = new KitRpcApi(AuthConfiguration.Instance);
      const versionResponse = await api
        .version({
          kitSerial: kit.serial,
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
          kitSerial: kit.serial,
        })
        .toPromise();
      this.setState({ uptimeResponse: `${uptimeResponse} seconds` });
    } finally {
      this.setState({ uptimeRequesting: false });
    }
  }

  async peripheralCommandRequest() {
    this.setState({ peripheralCommandRequesting: true, uptimeResponse: null });
    const { kit } = this.props;

    try {
      const api = new MyKitRpcApi(configuration);
      const response = await api
        .peripheralCommand({
          kitSerial: kit.serial,
          peripheral: this.state.peripheralCommandPeripheral,
          command: JSON.parse(this.state.peripheralCommandCommand),
        })
        .toPromise();
      if (response.content.type === "image/png") {
        const url = URL.createObjectURL(response.content);
        console.log(url);
        this.setState({
          peripheralCommandResponse: { mediaType: response.content.type, url },
        });
      }
      console.log(response);
    } finally {
      this.setState({ peripheralCommandRequesting: false });
    }
  }

  render() {
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
        <Divider />
        <Input
          placeholder="name of peripheral"
          onChange={(e) =>
            this.setState({ peripheralCommandPeripheral: e.target.value })
          }
        />{" "}
        <Input
          placeholder="command"
          onChange={(e) =>
            this.setState({ peripheralCommandCommand: e.target.value })
          }
        />
        <br /> <br />
        <Button
          onClick={() => this.peripheralCommandRequest()}
          loading={this.state.peripheralCommandRequesting}
          disabled={this.state.peripheralCommandRequesting}
          primary
        >
          Send command
        </Button>
        <br />
        {this.state.peripheralCommandResponse &&
          this.state.peripheralCommandResponse.mediaType === "image/png" && (
            <img
              alt="RPC command response"
              src={this.state.peripheralCommandResponse.url}
              style={{ width: "100%" }}
            />
          )}
      </Container>
    );
  }
}
