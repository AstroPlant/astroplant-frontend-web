import React, { PropsWithChildren, useState } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Observable, firstValueFrom } from "rxjs";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { JSONSchema7 } from "json-schema";
import { UiSchema, FormValidation } from "@rjsf/utils";
import validator from "@rjsf/validator-ajv8";

import RjsfForm from "~/rjsf-theme";

import {
  Notification,
  notificationConnectionIssue,
} from "~/modules/notification";
import { addNotificationRequest } from "~/modules/notification/actions";

import { requestWrapper } from "~/utils/api";
import { PDInvalidParameters, InvalidParametersFormErrors } from "../problems";
import { ErrorResponse } from "~/api";

export type Props<T, R> = {
  schema: JSONSchema7;
  uiSchema: UiSchema;
  validate?: (formData: T, errors: FormValidation) => FormValidation;
  transform?: (formData: T) => any;
  send: (data: any) => Observable<R>;
  onResponse: (response: R) => void;
  submitLabel?: string;
  formData?: any;
  /** Show form fields (and the submit button) as disabled. */
  disabled?: boolean;
  /** Hide the submit button. */
  readonly?: boolean;
};

type AllProps<T, R> = PropsWithChildren<
  WithTranslation &
    Props<T, R> & {
      addNotificationRequest: (
        notification: Notification,
        timeout?: number | null,
      ) => void;
    }
>;

/** A json-schema based form with functionality to interact with the API.
 *
 * Child components are rendered in the same Form.Group as the submit button.
 */
function ApiForm<T = any, R = any>(props: AllProps<T, R>) {
  const { t, children, formData: initialFormData, disabled, readonly } = props;
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [formEpoch, setFormEpoch] = useState(0);
  const [additionalFormErrors, setAdditionalFormErrors] =
    useState<InvalidParametersFormErrors>({});

  const submit = async (formData: T) => {
    setSubmitting(true);
    setFormEpoch(formEpoch + 1);
    setFormData(formData);
    setAdditionalFormErrors({});

    try {
      const payload = props.transform ? props.transform(formData) : formData;
      const response = await firstValueFrom(
        props.send(payload).pipe(requestWrapper()),
      );

      setSubmitting(false);
      props.onResponse(response);
    } catch (e) {
      setSubmitting(false);

      // How to handle situations where we don't know the error type? Currently
      // we just... ignore them. Which is bad.
      if (e instanceof ErrorResponse) {
        if (e.details.status === 0 || e.details.status >= 500) {
          props.addNotificationRequest(notificationConnectionIssue(t));
        }

        if (e.details.type === "APPLICATION") {
          const formErrors = PDInvalidParameters.toFormErrors(
            t,
            e.details.data,
          );
          if (formErrors !== null) {
            setAdditionalFormErrors(formErrors);
          }
        }
      }
    }
  };

  return (
    <>
      <RjsfForm
        key={formEpoch}
        schema={props.schema}
        uiSchema={props.uiSchema}
        customValidate={props.validate}
        onChange={({ formData }) => setFormData(formData)}
        onSubmit={({ formData }) => submit(formData)}
        formData={formData}
        disabled={disabled || readonly || submitting}
        // @ts-ignore
        extraErrors={additionalFormErrors}
        validator={validator}
      >
        {readonly === true ? (
          // Empty RjsfForm children to hide the default submit button.
          <>{children && <Form.Group>{children}</Form.Group>}</>
        ) : (
          <Form.Group>
            <Form.Button
              type="submit"
              primary
              disabled={disabled || submitting}
              loading={submitting}
            >
              {props.submitLabel || t("form.submit")}
            </Form.Button>
            {children}
          </Form.Group>
        )}
      </RjsfForm>
    </>
  );
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      addNotificationRequest,
    },
    dispatch,
  );

export default function Conn<T, R>(): React.ComponentType<Props<T, R>> {
  return connect(
    null,
    mapDispatchToProps,
  )(withTranslation()(ApiForm as React.ComponentType<AllProps<T, R>>));
}
