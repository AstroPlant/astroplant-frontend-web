import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Container, Divider, Card, Image, Header } from "semantic-ui-react";

import { RootState } from "~/types";

import {
  withAuthentication,
  WithAuthentication,
} from "~/Components/AuthenticatedGuard";
import Gravatar from "~/Components/Gravatar";
import HeadTitle from "~/Components/HeadTitle";
import PlaceholderSegment from "~/Components/PlaceholderSegment";
import { useAppSelector } from "~/hooks";
import { selectMe } from "~/modules/me/reducer";
import { kitSelectors } from "~/modules/kit/reducer";

type Props = WithAuthentication;

function Me({ me }: Props) {
  const { t } = useTranslation();

  const { kitMemberships, loadingKitMemberships } = useAppSelector(selectMe);
  const kitStates = useAppSelector(kitSelectors.selectEntities);

  return (
    <>
      <HeadTitle
        main={t("me.header", {
          displayName: me.displayName,
        })}
      />
      <Container text style={{ marginTop: "1em" }}>
        <Header size="large">Your kits</Header>
        {Object.keys(kitMemberships).length > 0 || loadingKitMemberships ? (
          <>
            <p>
              <Link to="/create-kit">Create another.</Link>
            </p>
            {Object.keys(kitMemberships).length > 0 && (
              <Card.Group>
                {Object.keys(kitMemberships).map((serial) => {
                  const kitState = kitStates[serial];
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
                            ? kitState.details?.name ?? t("kit.unnamed")
                            : "Loading"}
                        </Card.Header>
                        <Card.Meta>Serial: {serial}</Card.Meta>
                      </Card.Content>
                    </Card>
                  );
                })}
              </Card.Group>
            )}
            {loadingKitMemberships && <PlaceholderSegment />}
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
            <Card.Header>{me.displayName}</Card.Header>
            <Card.Meta>{me.emailAddress}</Card.Meta>
          </Card.Content>
          <Card.Content extra>
            {t("me.content.usernameLabel", {
              username: me.username,
            })}
          </Card.Content>
        </Card>
      </Container>
    </>
  );
}

export default withAuthentication()(Me);
