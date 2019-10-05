import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Transition, Container, List } from "semantic-ui-react";
import Notification from "./components/Notification";
import { RootState } from "types";
import { removeNotification } from "modules/notification/actions";

type Props = {
  notifications: RootState["notification"]["notifications"];
  removeNotification: (id: string) => void;
};

class Notifications extends React.Component<Props> {
  render() {
    return (
      <div style={{ position: "absolute", top: "3em", right: "3em" }}>
        <Container text>
          <Transition.Group duration={500} animation="slide left" as={List}>
            {Object.entries(this.props.notifications).map(
              ([id, notification]) => (
                <List.Item>
                  <Notification
                    key={id}
                    dismiss={() => {
                      this.props.removeNotification(id);
                    }}
                    notification={notification.notification}
                    time={notification.time}
                  />
                </List.Item>
              )
            )}
          </Transition.Group>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return { notifications: state.notification.notifications };
};

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      removeNotification
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);
