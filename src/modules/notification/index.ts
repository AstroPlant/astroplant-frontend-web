export enum NotificationKind {
  neutral,
  success,
  warning,
  error
}

export interface Notification {
  title: string;
  body: string;
  kind: NotificationKind;
}

export function notification(
  title: string,
  body: string,
  kind: NotificationKind
): Notification {
  return {
    title,
    body,
    kind
  };
}

export function notificationSuccess(title: string, body: string): Notification {
  return notification(title, body, NotificationKind.success);
}

export function notificationWarning(title: string, body: string): Notification {
  return notification(title, body, NotificationKind.warning);
}

export function notificationError(title: string, body: string): Notification {
  return notification(title, body, NotificationKind.error);
}
