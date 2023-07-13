import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
import { Container, Divider, Card, Image, Header } from "semantic-ui-react";

import { RootState } from "~/types";

import {
  withAuthentication,
  WithAuthentication,
} from "~/Components/AuthenticatedGuard";
import Gravatar from "~/Components/Gravatar";
import HeadTitle from "~/Components/HeadTitle";
import PlaceholderSegment from "~/Components/PlaceholderSegment";

type Props = WithTranslation &
  WithAuthentication & {
    loadingKitMemberships: boolean;
    kitMemberships: RootState["me"]["kitMemberships"];
    kitStates: RootState["kit"]["kits"];
  };

class Me extends Component<Props> {
  render() {
    const { t, me } = this.props;

    return (
      <>
        <HeadTitle
          main={t("me.header", {
            displayName: this.props.me.displayName,
          })}
        />
        <Container text style={{ marginTop: "1em" }}>
          <Header size="large">Your kits</Header>
          {Object.keys(this.props.kitMemberships).length > 0 ||
          this.props.loadingKitMemberships ? (
            <>
              <p>
                <Link to="/create-kit">Create another.</Link>
              </p>
              {Object.keys(this.props.kitMemberships).length > 0 && (
                <Card.Group>
                  {Object.keys(this.props.kitMemberships).map((serial) => {
                    const kitState = this.props.kitStates.entities[serial];
                    return (
                      <Card
                        fluid
                        key={serial}
                        color="orange"
                        as={Link}
                        to={`/kit/${serial}`}
                      >
                        <Card.Content>
                          <Image floated="right" size="mini">
                            <Gravatar identifier={serial} />
                          </Image>
                          <Card.Header>
                            {kitState
                              ? (kitState.details && kitState.details.name) ||
                                t("kit.unnamed")
                              : "Loading"}
                          </Card.Header>
                          <Card.Meta>Serial: {serial}</Card.Meta>
                        </Card.Content>
                      </Card>
                    );
                  })}
                </Card.Group>
              )}
              {this.props.loadingKitMemberships && <PlaceholderSegment />}
            </>
          ) : (
            <div>
              You have no kits yet.{" "}
              <Link to="/create-kit">You can create one!</Link>
            </div>
          )}
          <Divider />
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
                username: this.props.me.username,
              })}
            </Card.Content>
          </Card>
        </Container>
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    loadingKitMemberships: state.me.loadingKitMemberships,
    kitMemberships: state.me.kitMemberships,
    kitStates: state.kit.kits,
  };
};

export default withAuthentication()(
  connect(mapStateToProps)(withTranslation()(Me))
);
