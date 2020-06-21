import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Button, Select, Image, Segment } from "semantic-ui-react";

import { RootState } from "types";
import { KitState, KitConfigurationState } from "modules/kit/reducer";
import { KitRpcApi, schemas } from "api";
import { configuration, rateLimit } from "utils/api";
import PeripheralDefinitionCard from "Components/PeripheralDefinitionCard";
import RjsfForm from "rjsf-theme-semantic-ui";

export type Props = {
  kitState: KitState;
  peripheralDefinitions: { [id: string]: schemas["PeripheralDefinition"] };
};

function PeripheralCommand(props: Props) {
  const [
    activeConfiguration,
    setActiveConfiguration,
  ] = useState<KitConfigurationState | null>(null);
  const [peripheralId, setPeripheralId] = useState<number | null>(null);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [plaintext, setPlaintext] = useState<string | null>(null);

  const { kitState, peripheralDefinitions } = props;
  const kit = kitState.details.unwrap();

  useEffect(() => {
    for (const configuration of Object.values(
      kitState.configurations.unwrap()
    )) {
      if (configuration.active) {
        setActiveConfiguration(configuration);
        break;
      }
    }
  }, [kitState.configurations]);

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
        {peripheralId !== null &&
          (() => {
            const peripheral = activeConfiguration.peripherals[peripheralId]!;
            const peripheralDefinition = peripheralDefinitions[
              peripheral.peripheralDefinitionId
            ]!;
            return (
              <>
                <PeripheralDefinitionCard
                  peripheralDefinition={peripheralDefinition}
                />
                <h3>Command</h3>
                <RjsfForm
                  schema={peripheralDefinition.commandSchema!}
                  onSubmit={({ formData }) => sendPeripheralCommand(formData)}
                >
                  <Button type="submit" primary>
                    Send command to kit
                  </Button>
                </RjsfForm>
              </>
            );
          })()}
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
    //<RjsfForm schema={schema} />
  } else {
    return <div>No active configuration.</div>;
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    peripheralDefinitions: state.peripheralDefinition.definitions,
  };
};

export default connect(mapStateToProps)(PeripheralCommand);
