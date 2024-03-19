import { useMemo } from "react";
import { Container } from "semantic-ui-react";
import { DateTime, Duration } from "luxon";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import HeadTitle from "../Components/HeadTitle";
import { rtkApi } from "~/services/astroplant";
import { KitAvatar } from "~/Components/KitAvatar";
import { Badge } from "~/Components/Badge";
import { KitActiveBadge } from "~/Components/KitActiveBadge";

import style from "./Home.module.css";

export default function Home() {
  const { t } = useTranslation();

  // Find kits that were active in the past hour ...
  const lastSeenSince = useMemo(() => {
    const dateTime = DateTime.now().minus(
      Duration.fromMillis(1000 * 60 * 60 * 1),
    );
    return dateTime.toISO();
  }, []);
  const { data } = rtkApi.useListKitsQuery({ lastSeenSince });

  // ... and pick one.
  const activeKit = useMemo(() => {
    if (data === undefined || data.length === 0) {
      return undefined;
    }

    const favoredKitSerials = ["k-hvcx-p3qg-7dfq", "k-mqym-kdc8-b3t9"];
    const specificKit = data.find((kit) => kit.serial in favoredKitSerials);
    if (specificKit) {
      return specificKit;
    }

    const filtered = data.filter(
      (kit) => kit.name && kit.description && kit.latitude && kit.longitude,
    );

    return filtered[Math.floor(Math.random() * filtered.length)];
  }, [data]);

  return (
    <>
      <HeadTitle main={t("home.header")} />
      <Container text style={{ marginTop: "1em" }}>
        <h2>{t("home.content.title")}</h2>

        <p>{t("home.content.body1")}</p>

        {activeKit !== undefined && (
          <>
            <p>For an example, see this kit:</p>
            <section className={style.activeKit}>
              <KitAvatar serial={activeKit.serial} fontSize="1.25rem" />
              <div>
                <header className={style.activeKitHeader}>
                  <Link to={`/kit/${activeKit.serial}`}>
                    <h3>{activeKit.name}</h3>
                  </Link>
                  <KitActiveBadge kit={activeKit} />
                  {activeKit.privacyPublicDashboard && (
                    <Badge variant="muted" size="small" text="Public" />
                  )}
                </header>
                <p>{activeKit.serial}</p>
              </div>
            </section>
          </>
        )}

        <p>{t("home.content.body2")}</p>
        <p>{t("home.content.body3")}</p>
      </Container>
    </>
  );
}
