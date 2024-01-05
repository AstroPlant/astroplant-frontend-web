import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Image } from "semantic-ui-react";

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

import commonStyle from "~/Common.module.css";
import style from "./index.module.css";
import { KitAvatar } from "~/Components/KitAvatar";
import { Badge } from "~/Components/Badge";

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
      <section
        className={commonStyle.containerRegular}
        style={{ marginTop: "1em" }}
      >
        <h2>Your kits</h2>
        {Object.keys(kitMemberships).length > 0 || loadingKitMemberships ? (
          <>
            <p>
              <Link to="/create-kit">Create another.</Link>
            </p>
            <ul className={style.kitList}>
              {Object.keys(kitMemberships).map((serial) => {
                const kitState = kitStates[serial];
                return (
                  <li key={serial}>
                    <KitAvatar serial={serial} />
                    <div>
                      <header className={style.itemHeader}>
                        <Link to={`/kit/${serial}`}>
                          <h3>{kitState?.details?.name ?? t("kit.unnamed")}</h3>
                        </Link>
                        {kitState?.details?.privacyPublicDashboard && (
                          <Badge variant="muted" size="small" text="Public" />
                        )}
                      </header>
                      <p>{serial}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            {loadingKitMemberships && <PlaceholderSegment />}
          </>
        ) : (
          <p>
            You have no kits yet.{" "}
            <Link to="/create-kit">You can create one!</Link>
          </p>
        )}
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
      </section>
    </>
  );
}

export default withAuthentication()(Me);
