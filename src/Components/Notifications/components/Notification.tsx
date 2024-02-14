import { useEffect, useMemo, useState } from "react";
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

export function NotificationMsg({ notification, time: time_, dismiss }: Props) {
  const time = useMemo(
    () =>
      time_
        ? { to: DateTime.fromISO(time_.to), from: DateTime.fromISO(time_.from) }
        : undefined,
    [time_],
  );

  const [progress, setProgress] = useState(time ? 100 : undefined);

  useEffect(() => {
    if (time !== undefined) {
      const { from, to } = time;
      const interval = setInterval(() => {
        const now = DateTime.now();

        const total = Interval.fromDateTimes(from, to).length("milliseconds");
        const elapsed = Interval.fromDateTimes(from, now).length(
          "milliseconds",
        );

        const progress = (elapsed / total) * 100;
        setProgress(Math.max(0, 100 - progress));
      }, 1000 / 60);
      return () => clearInterval(interval);
    }
  }, [time]);

  return (
    <>
      <Message
        attached={progress !== undefined ? "top" : false}
        header={notification.title}
        content={notification.body}
        success={notification.kind === NotificationKind.success}
        warning={notification.kind === NotificationKind.warning}
        error={notification.kind === NotificationKind.error}
        onDismiss={dismiss}
      />
      {progress !== undefined && <Progress percent={progress || 0} attached="bottom" />}
    </>
  );
}

export default NotificationMsg;
