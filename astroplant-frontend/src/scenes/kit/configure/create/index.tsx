import React, { useContext, useState } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { RouteComponentProps, Redirect } from "react-router";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container, Segment } from "semantic-ui-react";

import { JSONSchema7 } from "json-schema";
import ApiForm from "~/Components/ApiForm";

import { kitConfigurationCreated } from "~/modules/kit/actions";

import { KitsApi, KitConfiguration } from "astroplant-api";
import { AuthConfiguration } from "~/utils/api";
import Option from "~/utils/option";

import { KitContext } from "../../contexts";

const CreateConfigurationForm = ApiForm<any, KitConfiguration>();

type Params = { kitSerial: string };

export type Props = WithTranslation &
  RouteComponentProps<Params> & {
    kitConfigurationCreated: (payload: {
      serial: string;
      configuration: KitConfiguration;
    }) => void;
  };

function CreateConfiguration(props: Props) {
  const { t, kitConfigurationCreated } = props;

  const [done, setDone] = useState(false);
  const [result, setResult] = useState<Option<KitConfiguration>>(Option.none());

  const kit = useContext(KitContext);

  const onResponse = (response: KitConfiguration) => {
    setResult(Option.some(response));
    setDone(true);
    kitConfigurationCreated({
      serial: kit.serial,
      configuration: response,
    });
  };

  const send = (formData: any) => {
    const api = new KitsApi(AuthConfiguration.Instance);
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
          <Redirect to={`/kit/${kit.serial}/configure/${result.unwrap().id}`} />
        ) : (
          <>
            <CreateConfigurationForm
              schema={schema}
              uiSchema={uiSchema}
              send={send}
              onResponse={onResponse}
            />
          </>
        )}
      </Segment>
    </Container>
  );
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      kitConfigurationCreated,
    },
    dispatch
  );

export default connect(
  null,
  mapDispatchToProps
)(withTranslation()(CreateConfiguration));
