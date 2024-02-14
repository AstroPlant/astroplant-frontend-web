import React from "react";
import { Message, Progress } from "semantic-ui-react";
import { DateTime, Interval } from "luxon";
import { Notification, NotificationKind } from "~/modules/notification";

export type Props = {
  notification: Notification;
  time?: { from: string; to: string };
  dismiss: () => void;
};

export type State = {
  progress: number | null;
};

class NotificationMsg extends React.Component<Props, State> {
  interval: any;

  state = {
    progress: null,
  };

  constructor(props: Props) {
    super(props);

    if (props.time !== undefined) {
      this.interval = setInterval(this.update.bind(this), 1000 / 60);
    }
  }

  update() {
    const from = DateTime.fromISO(this.props.time!.from);
    const to = DateTime.fromISO(this.props.time!.to);
    const now = DateTime.now();

    const total = Interval.fromDateTimes(from, to).length("milliseconds");
    const elapsed = Interval.fromDateTimes(from, now).length("milliseconds");

    const progress = (elapsed / total) * 100;

    this.setState({
      progress: 100 - progress,
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
