import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Container,
  Divider,
  Card,
  Image,
  Header
} from "semantic-ui-react";

import { RootState } from "types";
import { KitMembership } from "astroplant-api";

//import { withOption } from "../../Components/OptionGuard";
import {
  withAuthentication,
  WithAuthentication
} from "../../Components/AuthenticatedGuard";
import Gravatar from "../../Components/Gravatar";
import HeadTitle from "../../Components/HeadTitle";

type Props = WithTranslation &
  WithAuthentication & {
    kitMemberships: KitMembership[];
  };

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
          <Header size="large">Your kits</Header>
          {this.props.kitMemberships.length > 0 ? (
            <>
              <p>
                <Link to="/create-kit">Create another.</Link>
              </p>
              <Card.Group>
                {this.props.kitMemberships.map(
                  (kitMembership: KitMembership, index) => {
                    return (
                      <Card fluid key={index} color="orange" as={Link} to={`/kit/${kitMembership.kit.serial}`}>
                        <Card.Content>
                          <Image floated="right" size="mini">
                            <Gravatar identifier={kitMembership.kit.serial} />
                          </Image>
                          <Card.Header>{kitMembership.kit.name}</Card.Header>
                          <Card.Meta>
                            Serial: {kitMembership.kit.serial}
                          </Card.Meta>
                        </Card.Content>
                      </Card>
                    );
                  }
                )}
              </Card.Group>
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
  return { kitMemberships: state.me.kitMemberships };
};

export default withAuthentication()(
  connect(mapStateToProps)(withTranslation()(Me))
);
