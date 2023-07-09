import React, { useState, useContext } from "react";
import { RouteComponentProps } from "react-router";
import { Container, Button, Input, Divider } from "semantic-ui-react";

import { KitRpcApi } from "astroplant-api";
import { AuthConfiguration } from "~/utils/api";

import { KitContext } from "../contexts";

import PeripheralCommand from "./PeripheralCommand";
import { firstValueFrom } from "rxjs";

type Params = { kitSerial: string };
export type Props = RouteComponentProps<Params>;

export default function KitRpc(_props: Props) {
  const [versionRequesting, setVersionRequesting] = useState(false);
  const [versionResponse, setVersionResponse] = useState<string | null>(null);
  const [uptimeRequesting, setUptimeRequesting] = useState(false);
  const [uptimeResponse, setUptimeResponse] = useState<string | null>(null);

  const kit = useContext(KitContext);

  const versionRequest = async () => {
    setVersionRequesting(true);
    setVersionResponse(null);

    try {
      const api = new KitRpcApi(AuthConfiguration.Instance);
      const versionResponse = await firstValueFrom(
        api.version({
          kitSerial: kit.serial,
        })
      );
      setVersionResponse(versionResponse);
    } finally {
      setVersionRequesting(false);
    }
  };

  const uptimeRequest = async () => {
    setUptimeRequesting(true);
    setUptimeResponse(null);

    try {
      const api = new KitRpcApi(AuthConfiguration.Instance);
      const uptimeResponse = await api
        .uptime({
          kitSerial: kit.serial,
        })
        .toPromise();
      setUptimeResponse(`${uptimeResponse} seconds`);
    } finally {
      setUptimeRequesting(false);
    }
  };

  return (
    <Container text>
      <Button
        onClick={() => versionRequest()}
        loading={versionRequesting}
        disabled={versionRequesting}
        primary
      >
        Query kit version
      </Button>
      <Input
        readOnly
        value={versionResponse || ""}
        placeholder="kit response"
      />
      <Divider />
      <Button
        onClick={() => uptimeRequest()}
        loading={uptimeRequesting}
        disabled={uptimeRequesting}
        primary
      >
        Query kit uptime
      </Button>
      <Input readOnly value={uptimeResponse || ""} placeholder="kit response" />
      <Divider />
      <h2>Send command</h2>
      <PeripheralCommand />
    </Container>
  );
}
