import { useContext } from "react";

import commonStyle from "~/Common.module.css";

import { KitContext } from "../contexts";
import KitSerial from "./components/KitSerial";
import ResetPassword from "./components/ResetPassword";

import style from "./index.module.css";

export default function KitConfigure() {
  const kit = useContext(KitContext);

  return (
    <section className={commonStyle.containerRegular}>
      <h2>General</h2>
      <KitSerial kit={kit} />
      <h2>Danger</h2>
      <ul className={style.danger}>
        <li>
          <ResetPassword kit={kit} />
        </li>
      </ul>
    </section>
  );
}
