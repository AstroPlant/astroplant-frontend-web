import React, { useContext, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Select, Image, Segment } from "semantic-ui-react";

import { KitConfigurationState } from "~/modules/kit/reducer";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";
import { KitRpcApi } from "~/api";
import { configuration, rateLimit } from "~/utils/api";
import PeripheralDefinitionCard from "~/Components/PeripheralDefinitionCard";
import RjsfForm from "~/rjsf-theme-semantic-ui";

import { KitContext, ConfigurationsContext } from "../contexts";

export type Props = {};

export default function PeripheralCommand(props: Props) {
  const peripheralDefinitions = useSelector(
    peripheralDefinitionsSelectors.selectEntities
  );

  const [
    activeConfiguration,
    setActiveConfiguration,
  ] = useState<KitConfigurationState | null>(null);
  const [peripheralId, setPeripheralId] = useState<number | null>(null);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [plaintext, setPlaintext] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  const kit = useContext(KitContext);
  const configurations = useContext(ConfigurationsContext);

  useEffect(() => {
    for (const configuration of Object.values(configurations)) {
      if (configuration.active) {
        setActiveConfiguration(configuration);
        break;
      }
    }
  }, [configurations]);

  useEffect(() => {
    return () => {
      if (displayUrl !== null) {
        URL.revokeObjectURL(displayUrl);
      }
    };
  }, [displayUrl]);

  const sendPeripheralCommand = async (formData: any) => {
    setDisplayUrl(null);
    setPlaintext(null);
    const peripheral = activeConfiguration!.peripherals[peripheralId!]!;
    const api = new KitRpcApi(configuration);
    const response = await api
      .peripheralCommand({
        kitSerial: kit.serial,
        peripheral: peripheral.name,
        command: formData,
      })
      .pipe(rateLimit)
      .toPromise();

    if (
      response.content.type === "image/png" ||
      response.content.type === "image/jpeg" ||
      response.content.type === "image/gif"
    ) {
      const url = URL.createObjectURL(response.content);
      setDisplayUrl(url);
    } else if (response.content.type === "text/plain") {
      setPlaintext(await response.content.text());
    }
  };

  if (activeConfiguration !== null) {
    let form = null;
    if (peripheralId !== null) {
      const peripheral = activeConfiguration.peripherals[peripheralId]!;
      const peripheralDefinition = peripheralDefinitions[
        peripheral.peripheralDefinitionId
      ]!;
      form = (
        <>
          <PeripheralDefinitionCard
            peripheralDefinition={peripheralDefinition}
          />
          <h3>Command</h3>
          <RjsfForm
            key={0}
            schema={peripheralDefinition.commandSchema!}
            onChange={({ formData }) => setFormData(formData)}
            formData={formData}
            onSubmit={({ formData }) => sendPeripheralCommand(formData)}
          >
            <Button type="submit" primary>
              Send command to kit
            </Button>
          </RjsfForm>
        </>
      );
    }

    return (
      <>
        <div>
          <p>Please choose the peripheral to send a command to.</p>
          <Select
            value={peripheralId || undefined}
            onChange={(_ev, data) => setPeripheralId(data.value as number)}
            options={Object.values(activeConfiguration.peripherals)
              .filter(
                (peripheral) =>
                  peripheralDefinitions[peripheral.peripheralDefinitionId]!
                    .commandSchema !== null
              )
              .map((peripheral) => ({
                text: peripheral.name,
                value: peripheral.id,
              }))}
          />
        </div>
        {form}
        {displayUrl !== null && (
          <>
            <h3>Image response</h3>
            <Image centered bordered src={displayUrl} />
          </>
        )}
        {plaintext !== null && (
          <>
            <h3>Plaintext response</h3>
            <Segment inverted>
              <code>{plaintext}</code>
            </Segment>
          </>
        )}
      </>
    );
  } else {
    return <div>No active configuration.</div>;
  }
}
