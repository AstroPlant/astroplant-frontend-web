import { useState, useContext } from "react";
import { Divider } from "semantic-ui-react";
import { firstValueFrom } from "rxjs";

import { KitContext } from "../contexts";
import PeripheralCommand from "./PeripheralCommand";
import { api } from "~/api";
import { Button } from "~/Components/Button";
import { Input } from "~/Components/Input";

import commonStyle from "~/Common.module.css";

export default function KitRpc() {
  const [versionRequesting, setVersionRequesting] = useState(false);
  const [versionResponse, setVersionResponse] = useState<string | null>(null);
  const [uptimeRequesting, setUptimeRequesting] = useState(false);
  const [uptimeResponse, setUptimeResponse] = useState<string | null>(null);

  const kit = useContext(KitContext);

  const versionRequest = async () => {
    setVersionRequesting(true);
    setVersionResponse(null);

    try {
      const versionResponse = await firstValueFrom(
        api.version({
          kitSerial: kit.serial,
        }),
      );
      setVersionResponse(versionResponse.data);
    } finally {
      setVersionRequesting(false);
    }
  };

  const uptimeRequest = async () => {
    setUptimeRequesting(true);
    setUptimeResponse(null);

    try {
      const uptimeResponse = await firstValueFrom(
        api.uptime({
          kitSerial: kit.serial,
        }),
      );
      setUptimeResponse(`${uptimeResponse.data} seconds`);
    } finally {
      setUptimeRequesting(false);
    }
  };

  return (
    <article className={commonStyle.containerRegular}>
      <Button
        onClick={() => versionRequest()}
        loading={versionRequesting}
        disabled={versionRequesting}
        variant="primary"
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
        variant="primary"
      >
        Query kit uptime
      </Button>
      <Input readOnly value={uptimeResponse || ""} placeholder="kit response" />
      <Divider />
      <h2>Send command</h2>
      <PeripheralCommand />
    </article>
  );
}
