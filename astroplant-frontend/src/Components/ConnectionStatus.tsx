import React from "react";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container, Message } from "semantic-ui-react";
import { RootState } from "~/types";

type Props = WithTranslation & {
  apiConnectionFailed: boolean;
};

class Notifications extends React.Component<Props> {
  render() {
    const { t } = this.props;

    if (this.props.apiConnectionFailed) {
      return (
        <div
          style={{ position: "fixed", top: "3em", left: "3em" }}
        >
          <Container text>
            <Message
              error={true}
              header={t("permanentConnectionIssue.title")}
              content={t("permanentConnectionIssue.body")}
            />
          </Container>
        </div>
      );
    } else {
      return <></>;
    }
  }
}

const mapStateToProps = (state: RootState) => {
  return { apiConnectionFailed: state.generic.apiConnectionFailed };
};

export default withTranslation()(connect(mapStateToProps)(Notifications));
