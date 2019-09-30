import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Container,
  Divider,
  Grid,
  Segment,
  Card,
  Image
} from "semantic-ui-react";

import { RootState, FullUser } from "types";

//import { withOption } from "../../Components/OptionGuard";
import {
  withAuthentication,
  WithAuthentication
} from "../../Components/AuthenticatedGuard";
import Gravatar from "../../Components/Gravatar";
import HeadTitle from "../../Components/HeadTitle";
import InfoBox from "../../Components/InfoBox";

type Props = WithTranslation & WithAuthentication;

class Me extends Component<Props> {
  render() {
    const { t, me } = this.props;

    return (
      <>
        <HeadTitle
          main={t("me.header", {
            displayName: this.props.me.displayName
          })}
        />
        <Container text style={{ marginTop: "1em" }}>
          <Card centered raised>
            <Image>
              <Gravatar
                identifier={
                  me.useEmailAddressForGravatar
                    ? me.emailAddress
                    : me.gravatarAlternative
                }
              />
            </Image>
            <Card.Content>
              <Card.Header>{this.props.me.displayName}</Card.Header>
              <Card.Meta>{this.props.me.emailAddress}</Card.Meta>
            </Card.Content>
            <Card.Content extra>
              {t("me.content.usernameLabel", {
                username: this.props.me.username
              })}
            </Card.Content>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return { option: state.me.details };
};

export default connect(mapStateToProps)(
  withAuthentication()(withTranslation()(Me))
);
