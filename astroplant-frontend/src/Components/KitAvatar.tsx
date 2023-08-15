import { useMemo } from "react";

import style from "./KitAvatar.module.css";

/** A kit avatar generated from its serial. This is used for quick visual identification. */
// TODO: maybe take an "identicon"-style approach.
export function KitAvatar({ serial }: { serial: string }) {
  const initials = useMemo(() => {
    if (serial.length === 16 && serial[0] === "k" && serial[1] === "-") {
      return (serial[2]! + serial[3]!).toUpperCase();
    } else if (serial.length >= 2) {
      return (serial[0]! + serial[1]!).toUpperCase();
    } else {
      return "AP";
    }
  }, [serial]);
  return (
    <div className={style.avatar} aria-hidden="true">
      {initials}
    </div>
  );
}
