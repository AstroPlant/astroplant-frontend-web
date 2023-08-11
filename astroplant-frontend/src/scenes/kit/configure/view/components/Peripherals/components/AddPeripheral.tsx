import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Container,
  Modal,
  Card,
  Header,
  Button,
  Icon,
  Transition,
} from "semantic-ui-react";

import { KitConfigurationState } from "~/modules/kit/reducer";
import { peripheralCreated } from "~/modules/kit/actions";
import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";

import { JSONSchema7 } from "json-schema";
import ApiForm from "~/Components/ApiForm";

import PeripheralDefinitionCard from "~/Components/PeripheralDefinitionCard";
import { api, Response, schemas } from "~/api";
import { useAppDispatch, useAppSelector } from "~/hooks";

export type Props = {
  kit: schemas["Kit"];
  configuration: KitConfigurationState;
};

const PeripheralForm = ApiForm<any, any>();

export default function AddPeripheral({ kit, configuration }: Props) {
  const { t } = useTranslation();
  const peripheralDefinitions = useAppSelector(
    peripheralDefinitionsSelectors.selectAll,
  );
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [peripheralDefinition, setPeripheralDefinition] = useState<
    schemas["PeripheralDefinition"] | null
  >(null);

  const handleClose = () => {
    setOpen(false);
    setDone(false);
    setPeripheralDefinition(null);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const selectPeripheralDefinition = (
    peripheralDefinition: schemas["PeripheralDefinition"],
  ) => {
    setPeripheralDefinition(peripheralDefinition);
  };

  const send = (formData: any) => {
    return api.createPeripheral({
      configurationId: configuration.id,
      newPeripheral: {
        ...formData,
        peripheralDefinitionId: peripheralDefinition!.id,
      },
    });
  };

  const onResponse = (response: Response<schemas["Peripheral"]>) => {
    dispatch(
      peripheralCreated({
        serial: kit.serial,
        peripheral: response.data,
      }),
    );
    setDone(true);
  };

  let content;

  if (done) {
    content = (
      <>
        <Header size="huge" icon textAlign="center">
          <Transition animation="drop" duration={450} transitionOnMount>
            <Icon name="check" circular />
          </Transition>
          <Header.Content>Success!</Header.Content>
        </Header>
        <Container textAlign="center">
          <p>The peripheral has been added.</p>
        </Container>
      </>
    );
  } else if (peripheralDefinition !== null) {
    const schema: JSONSchema7 = {
      type: "object",
      title: "Peripheral",
      required: ["name", "configuration"],
      properties: {
        name: { type: "string", title: t("common.name") },
        configuration: peripheralDefinition.configurationSchema as object,
      },
    };
    content = (
      <>
        <PeripheralForm
          idPrefix="peripheralForm"
          schema={schema}
          uiSchema={{}}
          send={send}
          onResponse={onResponse}
          transform={(formData) => ({
            ...formData,
            peripheralDefinitionId: peripheralDefinition.id,
          })}
        />
      </>
    );
  } else {
    content = (
      <>
        <Header size="small">
          Please select the type of peripheral to add.
        </Header>
        <Card.Group centered>
          {peripheralDefinitions.map((def) => {
            return (
              <PeripheralDefinitionCard
                key={def.id}
                peripheralDefinition={def}
                onClick={() => selectPeripheralDefinition(def)}
              />
            );
          })}
        </Card.Group>
      </>
    );
  }

  // If we've selected a periheral don't making closing the modal too simple.
  const closeEasily = done || peripheralDefinition === null;

  return (
    <Modal
      trigger={
        <Button primary onClick={handleOpen}>
          Add a peripheral
        </Button>
      }
      closeOnEscape={closeEasily}
      closeOnDimmerClick={closeEasily}
      open={open}
      onClose={handleClose}
    >
      <Modal.Header>Add a peripheral</Modal.Header>
      <Modal.Content>{content}</Modal.Content>
      <Modal.Actions>
        {done ? (
          <Button color="green" onClick={handleClose}>
            <Icon name="checkmark" /> Ok
          </Button>
        ) : (
          <Button color="red" onClick={handleClose}>
            Cancel
          </Button>
        )}
      </Modal.Actions>
    </Modal>
  );
}
