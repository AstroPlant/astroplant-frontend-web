/**
 * This is the main navigation bar component that is to be displayed at the top
 * of the page. This navigation bar uses a single DOM tree and switches between
 * a wide style and a dropdown style using CSS media queries (an effect that is
 * purely presentational). The dropdown style functions by toggling CSS
 * classes.
 */

import React, { useCallback, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { IconUserCircle, IconMenu2 } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

import { rtkApi } from "~/services/astroplant";

import style from "./NavigationBar.module.css";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { persistor } from "~/store";

type NavigationBarProps = {
  pages: React.ReactNode;
  auth: React.ReactNode;
};

function Inner({ pages, auth }: NavigationBarProps) {
  const [expanded, setExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);
  const dropdownRef = useRef<HTMLElement>(null);

  const expander = useCallback(() => {
    let expanded_ = !expanded;
    setExpanded(expanded_);
    setMaxHeight(expanded_ ? dropdownRef.current!.scrollHeight : 0);
  }, [expanded, dropdownRef]);

  const label = expanded ? "Close main menu" : "Open main menu";

  return (
    <header className={style.header} role="banner">
      <div className={style.wrap}>
        <Link to="/home" className={style.logo}>
          <Logo variant="green" size={32} />
        </Link>
        <Button
          variant="text"
          onClick={expander}
          className={style.expand}
          title={label}
          aria-label={label}
          aria-controls="navbarDropdown"
          aria-expanded={expanded}
        >
          <IconMenu2 aria-hidden />
        </Button>
      </div>
      <nav
        ref={dropdownRef}
        id="navbarDropdown"
        className={clsx(style.main, expanded && style.expanded)}
        style={{ maxHeight: maxHeight }}
      >
        {pages}
        {auth}
      </nav>
    </header>
  );
}

export default function NavigationBar() {
  const { t } = useTranslation();

  const { data } = rtkApi.useGetMeQuery();
  const displayName = data?.displayName ?? null;

  const pages = (
    <ul className={style.pages}>
      <li>
        <NavLink to="/home" key="home">
          {t("common.home")}
        </NavLink>
      </li>
      <li>
        <NavLink to="/map" key="map">
          {t("common.map")}
        </NavLink>
      </li>
    </ul>
  );

  const auth = (
    <ul className={style.auth}>
      {displayName !== null ? (
        <>
          <li>
            <NavLink to="/me">
              <IconUserCircle /> {displayName}
            </NavLink>
          </li>
          <li>
            <Button
              variant="text"
              onClick={() => {
                persistor.purge();
                window.location.href = "/";
              }}
            >
              {t("common.logOut")}
            </Button>
          </li>
        </>
      ) : (
        <>
          <li>
            <NavLink to="/log-in">{t("common.logIn")}</NavLink>
          </li>
          <li>
            <NavLink to="/sign-up">{t("common.signUp")}</NavLink>
          </li>
        </>
      )}
    </ul>
  );

  return <Inner pages={pages} auth={auth} />;
}
