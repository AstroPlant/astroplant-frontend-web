import { useContext, useState, useEffect, useMemo } from "react";
import { Select, Image, Segment } from "semantic-ui-react";
import validator from "@rjsf/validator-ajv8";

import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";
import { api } from "~/api";
import PeripheralDefinitionCard from "~/Components/PeripheralDefinitionCard";
import { Button } from "~/Components/Button";
import RjsfForm from "~/rjsf-theme";

import { KitContext, ConfigurationsContext } from "../contexts";
import { firstValueFrom } from "rxjs";
import { useAppSelector } from "~/hooks";

export default function PeripheralCommand() {
  const peripheralDefinitions = useAppSelector(
    peripheralDefinitionsSelectors.selectEntities,
  );

  const [peripheralId, setPeripheralId] = useState<number | null>(null);
  const [displayUrl, setDisplayUrl] = useState<string | null>(null);
  const [plaintext, setPlaintext] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  const kit = useContext(KitContext);
  const configurations = useContext(ConfigurationsContext);

  const activeConfiguration = useMemo(
    () => Object.values(configurations).find((c) => c.active),
    [configurations],
  );

  useEffect(() => {
    return () => {
      if (displayUrl !== null) {
        URL.revokeObjectURL(displayUrl);
      }
    };
  }, [displayUrl]);

  const sendPeripheralCommand = async (formData: any) => {
    if (!activeConfiguration) {
      return;
    }

    setDisplayUrl(null);
    setPlaintext(null);
    const peripheral = activeConfiguration.peripherals[peripheralId!]!;
    const response = await firstValueFrom(
      api.peripheralCommand({
        kitSerial: kit.serial,
        peripheral: peripheral.name,
        command: formData,
      }),
    );

    if (
      response.data.type === "image/png" ||
      response.data.type === "image/jpeg" ||
      response.data.type === "image/gif"
    ) {
      const url = URL.createObjectURL(response.data);
      setDisplayUrl(url);
    } else if (response.data.type === "text/plain") {
      setPlaintext(await response.data.text());
    }
  };

  if (activeConfiguration !== undefined) {
    let form = null;
    if (peripheralId !== null) {
      const peripheral = activeConfiguration.peripherals[peripheralId]!;
      const peripheralDefinition =
        peripheralDefinitions[peripheral.peripheralDefinitionId]!;
      form = (
        <>
          <PeripheralDefinitionCard
            peripheralDefinition={peripheralDefinition}
          />
          <h3>Command</h3>
          <RjsfForm
            key={0}
            idPrefix="peripheralCommandForm"
            schema={peripheralDefinition.commandSchema!}
            onChange={({ formData }) => setFormData(formData)}
            formData={formData}
            onSubmit={({ formData }) => sendPeripheralCommand(formData)}
            validator={validator}
          >
            <Button type="submit" variant="positive">
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
                    .commandSchema !== null,
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
