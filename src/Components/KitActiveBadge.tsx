import { DateTime, Duration } from "luxon";
import { useMemo } from "react";

import { schemas } from "~/api";
import { useTime } from "~/hooks";

import style from "./KitActiveBadge.module.css";
import clsx from "clsx";

export function KitActiveBadge({ kit }: { kit: schemas["Kit"] }) {
  const now = useTime(Duration.fromMillis(10000));

  const [activeClass, title] = useMemo(() => {
    if (kit.lastSeen === undefined || kit.lastSeen === null) {
      return ["neverSeen", "Never seen"];
    } else {
      const lastSeen = DateTime.fromISO(kit.lastSeen);
      const ago = now.diff(lastSeen);

      let activeClass;
      if (ago.as("minutes") < 10) {
        activeClass = "active";
      } else if (ago.as("hours") < 4) {
        activeClass = "recentlyActive";
      } else {
        activeClass = "inactive";
      }

      return [
        activeClass,
        `Last seen ${lastSeen.toLocaleString(DateTime.DATETIME_SHORT)}`,
      ];
    }
  }, [now, kit]);

  return (
    <>
      <span
        role="status"
        className={clsx(style.badge, style[activeClass])}
        title={title}
      ></span>
    </>
  );
}
