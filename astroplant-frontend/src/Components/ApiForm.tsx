import React, { useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Observable } from "rxjs";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { JSONSchema7 } from "json-schema";
import { UiSchema, FormValidation } from "@rjsf/core";
import RjsfForm from "~/rjsf-theme-semantic-ui";

import {
  Notification,
  notificationConnectionIssue,
} from "~/modules/notification";
import { addNotificationRequest } from "~/modules/notification/actions";

import { requestWrapper } from "~/utils/api";
import { PDInvalidParameters, InvalidParametersFormErrors } from "../problems";

export type Props<T, R> = {
  schema: JSONSchema7;
  uiSchema: UiSchema;
  validate?: (formData: T, errors: FormValidation) => FormValidation;
  transform?: (formData: T) => any;
  send: (data: any) => Observable<R>;
  onResponse: (response: R) => void;
  submitLabel?: string;
  formData?: any;
};

type AllProps<T, R> = WithTranslation &
  Props<T, R> & {
    addNotificationRequest: (
      notification: Notification,
      timeout?: number | null
    ) => void;
  };

function ApiForm<T = any, R = any>(props: AllProps<T, R>) {
  const { t, formData: initialFormData } = props;
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [formEpoch, setFormEpoch] = useState(0);
  const [additionalFormErrors, setAdditionalFormErrors] = useState<
    InvalidParametersFormErrors
  >({});

  const submit = async (formData: T) => {
    setSubmitting(true);
    setFormEpoch(formEpoch + 1);
    setFormData(formData);
    setAdditionalFormErrors({});

    try {
      const payload = props.transform ? props.transform(formData) : formData;
      const response = await props
        .send(payload)
        .pipe(requestWrapper())
        .toPromise();

      setSubmitting(false);
      props.onResponse(response);
    } catch (e) {
      setSubmitting(false);

      console.warn("error on form submission", e, e.response);
      if (e.status === 0) {
        props.addNotificationRequest(notificationConnectionIssue(t));
      }

      const formErrors = PDInvalidParameters.toFormErrors(t, e.response);
      if (formErrors !== null) {
        console.warn("form errors", formErrors);
        setAdditionalFormErrors(formErrors);
      }
    }
  };

  return (
    <>
      <RjsfForm
        key={formEpoch}
        schema={props.schema}
        uiSchema={props.uiSchema}
        validate={props.validate}
        onChange={({ formData }) => setFormData(formData)}
        onSubmit={({ formData }) => submit(formData)}
        formData={formData}
        disabled={submitting}
        // @ts-ignore
        extraErrors={additionalFormErrors}
      >
        <Form.Button
          type="submit"
          primary
          disabled={submitting}
          loading={submitting}
        >
          {props.submitLabel || t("form.submit")}
        </Form.Button>
      </RjsfForm>
    </>
  );
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      addNotificationRequest,
    },
    dispatch
  );

export default function Conn<T, R>(): React.ComponentType<Props<T, R>> {
  return connect(
    null,
    mapDispatchToProps
  )(withTranslation()(ApiForm as React.ComponentType<AllProps<T, R>>));
}
