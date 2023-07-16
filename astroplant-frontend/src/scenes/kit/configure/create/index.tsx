import React, { useContext, useState } from "react";
import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Container, Segment } from "semantic-ui-react";

import { JSONSchema7 } from "json-schema";
import ApiForm from "~/Components/ApiForm";

import { kitConfigurationCreated } from "~/modules/kit/actions";

import { KitContext } from "../../contexts";
import { Response, api, schemas } from "~/api";
import { useAppDispatch } from "~/hooks";

const CreateConfigurationForm = ApiForm<
  any,
  Response<schemas["KitConfiguration"]>
>();

export default function CreateConfiguration() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const kit = useContext(KitContext);

  const [done, setDone] = useState(false);
  const [result, setResult] = useState<schemas["KitConfiguration"] | null>(
    null
  );

  const onResponse = (response: Response<schemas["KitConfiguration"]>) => {
    setResult(response.data);
    setDone(true);
    dispatch(
      kitConfigurationCreated({
        serial: kit.serial,
        configuration: response.data,
      })
    );
  };

  const send = (formData: any) => {
    return api.createConfiguration({
      kitSerial: kit.serial,
      newKitConfiguration: {
        description: formData.description,
      },
    });
  };

  const schema: JSONSchema7 = {
    type: "object",
    title: "Create configuration",
    required: [],
    properties: {
      description: { type: "string", title: t("common.description") },
    },
  };

  const uiSchema = {};

  return (
    <Container text>
      <Segment padded>
        {done ? (
          <Navigate to={`../${result!.id}`} replace />
        ) : (
          <CreateConfigurationForm
            schema={schema}
            uiSchema={uiSchema}
            send={send}
            onResponse={onResponse}
          />
        )}
      </Segment>
    </Container>
  );
}
