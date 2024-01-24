import React from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import clsx from "clsx";

import style from "./Menu.module.css";

export type MenuProps = {
  variant?: "underlined" | "shaded";
  children?: React.ReactNode;
};

export type MenuItemProps = {
  children?: React.ReactNode;
  link: NavLinkProps;
};

/** A tab menu. Its children should be zero or more `MenuItem`. */
export function Menu({ variant = "underlined", children }: MenuProps) {
  return (
    <nav className={clsx(style.menu, variant === "shaded" && style.shaded)}>
      <ul>{children}</ul>
    </nav>
  );
}

function MenuItem({ link, children }: MenuItemProps) {
  return (
    <li>
      <NavLink {...link}>{children}</NavLink>
    </li>
  );
}

Menu.Item = MenuItem;
