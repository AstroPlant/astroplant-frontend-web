import { useState } from "react";
import { Icon } from "semantic-ui-react";
import { JSONSchema7 } from "json-schema";

import ApiForm from "~/Components/ApiForm";
import { Response, api, schemas } from "~/api";
import { useAppDispatch } from "~/hooks";
import { rtkApi } from "~/services/astroplant";

export type Props = {
  kit: schemas["Kit"];
  configuration: schemas["KitConfigurationWithPeripherals"];
  readOnly: boolean;
};

const DescriptionForm = ApiForm<string, Response<schemas["KitConfiguration"]>>;

export default function Description({ kit, configuration, readOnly }: Props) {
  const dispatch = useAppDispatch();

  const [editing, setEditing] = useState(false);

  const onResponse = (_response: Response<schemas["KitConfiguration"]>) => {
    setEditing(false);
    dispatch(rtkApi.util.invalidateTags(["KitConfigurations"]));
  };

  const send = (formData: string) => {
    // TODO: use `rtkApi.usePatchKitConfiguration`
    return api.patchConfiguration({
      configurationId: configuration.id,
      patchKitConfiguration: {
        description: formData,
      },
    });
  };

  if (editing) {
    const schema: JSONSchema7 = {
      type: "string",
    };
    const uiSchema = {};

    return (
      <div>
        <DescriptionForm
          idPrefix="descriptionForm"
          schema={schema}
          uiSchema={uiSchema}
          send={send}
          onResponse={onResponse}
          formData={configuration.description}
        />
      </div>
    );
  } else if (readOnly) {
    return <div>{configuration.description}</div>;
  } else {
    return (
      <div onClick={() => setEditing(true)}>
        <Icon name="pencil" />
        {configuration.description}
      </div>
    );
  }
}
