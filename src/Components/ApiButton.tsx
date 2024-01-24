import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { firstValueFrom, Observable } from "rxjs";
import { withTranslation, WithTranslation } from "react-i18next";

import { Button, ButtonProps } from "./Button";

import {
  Notification,
  notificationConnectionIssue,
} from "~/modules/notification";
import { addNotificationRequest } from "~/modules/notification/actions";

import { requestWrapper } from "~/utils/api";
import { ModalConfirmDialog } from "./ModalDialog";

export type ConfirmLabels = {
  cancelButton?: string;
  confirmButton?: string;
  header?: string;
  content?: string;
};

type State = {
  submitting: boolean;
  confirming: boolean;
  confirmLabels: ConfirmLabels;
};

export type Props<R> = React.PropsWithChildren<{
  id?: string;
  send: () => Observable<R>;
  onResponse: (response: R) => void;
  label?: string;
  buttonProps?: ButtonProps;
  confirm?: () => {} | null;
}>;

type AllProps<R> = WithTranslation &
  Props<R> & {
    addNotificationRequest: (
      notification: Notification,
      timeout?: number | null,
    ) => void;
  };

class ApiButton<R = any> extends Component<AllProps<R>, State> {
  state = {
    submitting: false,
    confirming: false,
    confirmLabels: {} as ConfirmLabels,
  };

  async submit() {
    this.setState((state) => {
      return {
        submitting: true,
      };
    });

    const { t } = this.props;

    try {
      const response = await firstValueFrom(
        this.props.send().pipe(requestWrapper()),
      );

      this.setState({ submitting: false });
      this.props.onResponse(response);
    } catch (e_) {
      const e = e_ as any;
      this.setState({ submitting: false });

      console.warn("error on form submission", e, e.response);
      if (e.status === 0) {
        this.props.addNotificationRequest(notificationConnectionIssue(t));
      } else {
        this.props.addNotificationRequest(notificationConnectionIssue(t));
      }
    }
  }

  async click() {
    if (this.props.confirm) {
      const conf = this.props.confirm();
      if (conf !== null) {
        this.setState({
          confirming: true,
          confirmLabels: { ...this.state.confirmLabels, ...conf },
        });
        return;
      }
    }

    await this.submit();
  }

  async confirm() {
    this.setState({ confirming: false });
    await this.submit();
  }

  cancel() {
    this.setState({ confirming: false });
  }

  render() {
    const { t } = this.props;

    return (
      <>
        <Button
          id={this.props.id}
          {...this.props.buttonProps}
          onClick={(e) => {
            e.preventDefault();
            this.click();
          }}
          disabled={this.state.submitting}
          loading={this.state.submitting}
        >
          {this.props.children || this.props.label || t("form.submit")}
        </Button>
        <ModalConfirmDialog
          open={this.state.confirming}
          onConfirm={() => this.confirm()}
          onCancel={() => this.cancel()}
          cancelLabel={this.state.confirmLabels.cancelButton}
          confirmLabel={this.state.confirmLabels.confirmButton}
          header={this.state.confirmLabels.header}
        >
          {this.state.confirmLabels.content}
        </ModalConfirmDialog>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      addNotificationRequest,
    },
    dispatch,
  );

export default function Conn<R>(): React.ComponentType<Props<R>> {
  return connect(
    null,
    mapDispatchToProps,
  )(withTranslation()(ApiButton as React.ComponentType<AllProps<R>>));
}

/*export default connect<any, any, Props<T, R>>(
    null,
    mapDispatchToProps
)(withTranslation()(ApiForm));
*/
