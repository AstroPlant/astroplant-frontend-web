import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Header, Transition } from "semantic-ui-react";

import { selectors as peripheralDefinitionsSelectors } from "~/modules/peripheral-definition/reducer";

import { JSONSchema7 } from "json-schema";
import ApiForm from "~/Components/ApiForm";

import PeripheralDefinitionCard from "~/Components/PeripheralDefinitionCard";
import { api, Response, schemas } from "~/api";
import { useAppDispatch, useAppSelector } from "~/hooks";
import { Button } from "~/Components/Button";
import { IconCheck, IconCircleCheck, IconPlus } from "@tabler/icons-react";

import style from "./AddPeripheral.module.css";
import { ModalDialog } from "~/Components/ModalDialog";
import { rtkApi } from "~/services/astroplant";

export type Props = {
  kit: schemas["Kit"];
  configuration: schemas["KitConfigurationWithPeripherals"];
};

const PeripheralForm = ApiForm<any, any>;

export default function AddPeripheral({ kit: _, configuration }: Props) {
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

  const onResponse = (_response: Response<schemas["Peripheral"]>) => {
    dispatch(rtkApi.util.invalidateTags(["KitConfigurations"]));
    setDone(true);
  };

  let content;

  if (done) {
    content = (
      <div className={style.success}>
        <header>
          <Transition animation="drop" duration={450} transitionOnMount>
            <IconCircleCheck size="1em" aria-hidden />
          </Transition>
          <h2>Success!</h2>
        </header>
        <p>The peripheral has been added.</p>
      </div>
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
    <>
      <Button
        variant="primary"
        onClick={() => setOpen(true)}
        leftAdornment={<IconPlus aria-hidden />}
      >
        Add a peripheral
      </Button>
      <ModalDialog
        open={open}
        onClose={handleClose}
        header="Add a peripheral"
        actions={
          <>
            {done ? (
              <Button
                variant="positive"
                onClick={handleClose}
                leftAdornment={<IconCheck aria-hidden />}
              >
                Ok
              </Button>
            ) : (
              <Button variant="negative" onClick={handleClose}>
                Cancel
              </Button>
            )}
          </>
        }
      >
        {content}
      </ModalDialog>
    </>
  );
}
