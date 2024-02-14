import { Transition, Container, List } from "semantic-ui-react";

import { useAppDispatch, useAppSelector } from "~/hooks";

import Notification from "./components/Notification";
import { removeNotification } from "~/modules/notification/actions";

export default function Notifications() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.notification.notifications,
  );

  return (
    <div style={{ position: "fixed", top: "3em", right: "3em" }}>
      <Container text>
        <Transition.Group duration={500} animation="slide left" as={List}>
          {Object.entries(notifications).map(([id, notification]) => (
            <List.Item>
              <Notification
                key={id}
                dismiss={() => {
                  dispatch(removeNotification(id));
                }}
                notification={notification.notification}
                time={notification.time}
              />
            </List.Item>
          ))}
        </Transition.Group>
      </Container>
    </div>
  );
}
