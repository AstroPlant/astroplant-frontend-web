import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

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
      <article
        className={clsx(commonStyle.containerWide, style.wrapper)}
        style={{ marginTop: "1em" }}
      >
        <section className={style.profile}>
          <section className={style.avatar}>
            <Gravatar
              size={200}
              identifier={
                me.useEmailAddressForGravatar
                  ? me.emailAddress
                  : me.gravatarAlternative
              }
            />
          </section>
          <header>
            <h1>{me.displayName}</h1>
            <span>{me.username}</span>
            <section className={style.emailAddress}>{me.emailAddress}</section>
          </header>
        </section>
        <section className={style.kits}>
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
                      <KitAvatar serial={serial} fontSize="1.25rem" />
                      <div>
                        <header className={style.itemHeader}>
                          <Link to={`/kit/${serial}`}>
                            <h3>
                              {kitState?.details?.name ?? t("kit.unnamed")}
                            </h3>
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
        </section>
      </article>
    </>
  );
}

export default withAuthentication()(Me);
