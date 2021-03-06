import React from "react";
import { Message, Progress } from "semantic-ui-react";
import moment, { Moment } from "moment";
import Option from "utils/option";
import { Notification, NotificationKind } from "modules/notification";

export type Props = {
  notification: Notification;
  time: Option<{ from: Moment; to: Moment }>;
  dismiss: () => void;
};

export type State = {
  progress: number | null;
};

class NotificationMsg extends React.Component<Props, State> {
  interval: any;

  state = {
    progress: null
  };

  constructor(props: Props) {
    super(props);

    if (props.time.isSome()) {
      this.interval = setInterval(this.update.bind(this), 1000 / 60);
    }
  }

  update() {
    const { from, to } = this.props.time.unwrap();
    const now = moment();

    const total = to.diff(from, "ms");
    const elapsed = now.diff(from, "ms");

    const progress = (elapsed / total) * 100;

    this.setState({
      progress: 100 - progress
    });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { props, state } = this;
    return (
      <>
        <Message
          attached={(state.progress && "top") || false}
          header={props.notification.title}
          content={props.notification.body}
          success={props.notification.kind === NotificationKind.success}
          warning={props.notification.kind === NotificationKind.warning}
          error={props.notification.kind === NotificationKind.error}
          onDismiss={props.dismiss}
        />
        {state.progress && (
          <Progress percent={state.progress || 0} attached="bottom" />
        )}
      </>
    );
  }
}

export default NotificationMsg;
