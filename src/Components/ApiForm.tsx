import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Observable } from "rxjs";
import { withTranslation, WithTranslation } from "react-i18next";
import { Form } from "semantic-ui-react";
import { JSONSchema6 } from "json-schema";
import { UiSchema, FormValidation } from "react-jsonschema-form";
import RjsfForm from "../rjsf-theme-semantic-ui";

import {
  Notification,
  notificationConnectionIssue
} from "../modules/notification";
import { addNotificationRequest } from "../modules/notification/actions";

import { requestWrapper } from "utils/api";
import { PDInvalidParameters, InvalidParametersFormErrors } from "../problems";

type State<T> = {
  submitting: boolean;
  formEpoch: number; // Hacky var to reset form errors on submission.
  formData: T | null;
  additionalFormErrors: InvalidParametersFormErrors;
};

export type Props<T, R> = {
  schema: JSONSchema6;
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

class ApiForm<T = any, R = any> extends Component<AllProps<T, R>, State<T>> {
  state: State<T> = {
    submitting: false,
    formEpoch: 0,
    formData: null,
    additionalFormErrors: {}
  };

  async submit(formData: T) {
    this.setState((state: State<T>) => {
      return {
        submitting: true,
        formEpoch: state.formEpoch + 1,
        formData,
        additionalFormErrors: {}
      };
    });

    const { t } = this.props;

    try {
      const payload = this.props.transform
        ? this.props.transform(formData)
        : formData;
      const response = await this.props
        .send(payload)
        .pipe(requestWrapper())
        .toPromise();

      this.setState({ submitting: false });
      this.props.onResponse(response);
    } catch (e) {
      this.setState({ submitting: false });

      console.warn("error on form submission", e, e.response);
      if (e.status === 0) {
        this.props.addNotificationRequest(notificationConnectionIssue(t));
      }

      const formErrors = PDInvalidParameters.toFormErrors(
        this.props.t,
        e.response
      );
      if (formErrors !== null) {
        console.warn("form errors", formErrors);
        this.setState({ additionalFormErrors: formErrors });
      }
    }
  }

  render() {
    const { t } = this.props;

    return (
      <>
        <RjsfForm
          key={this.state.formEpoch}
          schema={this.props.schema}
          uiSchema={this.props.uiSchema}
          validate={this.props.validate}
          onSubmit={({ formData }) => this.submit(formData)}
          formData={this.state.formData || this.props.formData}
          disabled={this.state.submitting}
          // @ts-ignore
          extraErrors={this.state.additionalFormErrors}
        >
          <Form.Button
            type="submit"
            primary
            disabled={this.state.submitting}
            loading={this.state.submitting}
          >
            {this.props.submitLabel || t("form.submit")}
          </Form.Button>
        </RjsfForm>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      addNotificationRequest
    },
    dispatch
  );

export default function Conn<T, R>(): React.ComponentType<Props<T, R>> {
  return connect(
    null,
    mapDispatchToProps
  )(withTranslation()(ApiForm as React.ComponentType<AllProps<T, R>>));
}

/*export default connect<any, any, Props<T, R>>(
    null,
    mapDispatchToProps
)(withTranslation()(ApiForm));
*/
