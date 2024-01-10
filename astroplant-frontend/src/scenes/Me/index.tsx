import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IconEdit } from "@tabler/icons-react";
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
import { Input } from "~/Components/Input";
import { Button } from "~/Components/Button";
import { rtkApi } from "~/services/astroplant";

type Props = WithAuthentication;

function Me({ me }: Props) {
  const { t } = useTranslation();

  const { kitMemberships, loadingKitMemberships } = useAppSelector(selectMe);
  const kitStates = useAppSelector(kitSelectors.selectEntities);

  const [submitting, setSubmitting] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const [patchUser] = rtkApi.usePatchUserMutation();

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
          {editingProfile ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <fieldset disabled={submitting}>
                <label>
                  Name
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.currentTarget.value)}
                    fullWidth
                  />
                </label>
                <section style={{ marginTop: "0.5rem" }}>
                  <Button
                    type="submit"
                    variant="positive"
                    size="small"
                    onClick={async () => {
                      setSubmitting(true);
                      try {
                        await patchUser({
                          username: me.username,
                          patch: { displayName },
                        });
                        setEditingProfile(false);
                        // TODO: show errors
                      } finally {
                        setSubmitting(false);
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button
                    variant="muted"
                    size="small"
                    onClick={() => setEditingProfile(false)}
                  >
                    Cancel
                  </Button>
                </section>
              </fieldset>
            </form>
          ) : (
            <header>
              <h1>{me.displayName}</h1>
              <span>{me.username}</span>
              <section className={style.emailAddress}>
                {me.emailAddress}
              </section>
              <Button
                variant="muted"
                size="small"
                leftAdornment={<IconEdit />}
                style={{ width: "100%", marginTop: "1rem" }}
                onClick={() => {
                  setDisplayName(me.displayName);
                  setEditingProfile(true);
                }}
              >
                Edit profile
              </Button>
            </header>
          )}
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
