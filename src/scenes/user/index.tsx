import { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { IconEdit } from "@tabler/icons-react";

import { selectMe } from "~/modules/me/reducer";
import { useAppSelector } from "~/hooks";
import { rtkApi } from "~/services/astroplant";
import Gravatar from "~/Components/Gravatar";
import Loading from "~/Components/Loading";
import { Input } from "~/Components/Input";
import { Button } from "~/Components/Button";
import HeadTitle from "~/Components/HeadTitle";
import { KitAvatar } from "~/Components/KitAvatar";
import { Badge } from "~/Components/Badge";

import commonStyle from "~/Common.module.css";
import style from "./index.module.css";
import { KitActiveBadge } from "~/Components/KitActiveBadge";

export default function User({ username }: { username: string }) {
  // This component is used to render both the user profile of the logged-in
  // user as well as profiles of other users. If the profile of the logged-in
  // user is rendered, additional options are displayed, such as the ability to
  // edit the profile.

  const { username: meUsername } = useAppSelector(selectMe);
  const isMe = username === meUsername;

  const [submitting, setSubmitting] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const [patchUser] = rtkApi.usePatchUserMutation();

  const { data: me } = rtkApi.useGetMeQuery(undefined, { skip: !isMe });
  const { data: user_ } = rtkApi.useGetUserQuery({ username }, { skip: isMe });
  let user = user_;

  const { data: kitMemberships } = rtkApi.useGetUserKitMembershipsQuery({
    username,
  });

  if (user === undefined && me !== undefined) {
    user = {
      username: me.username,
      displayName: me.displayName,
      gravatar: me.useEmailAddressForGravatar
        ? me.emailAddress
        : me.gravatarAlternative,
    };
  }

  if (
    user === undefined ||
    kitMemberships === undefined ||
    (isMe && me === undefined)
  ) {
    return <Loading />;
  } else {
    return (
      <>
        <HeadTitle main={user.displayName} />
        <article
          className={clsx(commonStyle.containerWide, style.wrapper)}
          style={{ marginTop: "1rem" }}
        >
          <section className={style.profile}>
            <section className={style.avatar}>
              <Gravatar size={200} identifier={user.gravatar} />
            </section>
            {editingProfile && me !== undefined ? (
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
                <h1 className={style.displayName}>{user.displayName}</h1>
                <span>{user.username}</span>
                {me !== undefined && (
                  <section className={style.emailAddress}>
                    {me.emailAddress}
                  </section>
                )}
                {me !== undefined && (
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
                )}
              </header>
            )}
          </section>
          <section className={style.kits}>
            <h2>Kits</h2>
            {Object.keys(kitMemberships).length > 0 || false ? (
              <>
                {isMe && (
                  <p>
                    <Link to="/create-kit">Create another.</Link>
                  </p>
                )}
                <ul className={style.kitList}>
                  {kitMemberships.map((membership) => {
                    const kit = membership.kit;
                    return (
                      <li key={kit.serial}>
                        <KitAvatar serial={kit.serial} fontSize="1.25rem" />
                        <div>
                          <header className={style.itemHeader}>
                            <Link to={`/kit/${kit.serial}`}>
                              <h3>{kit.name}</h3>
                            </Link>
                            <KitActiveBadge kit={kit} />
                            {kit.privacyPublicDashboard && (
                              <Badge
                                variant="muted"
                                size="small"
                                text="Public"
                              />
                            )}
                          </header>
                          <p>{kit.serial}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                {false && <Loading />}
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
}
