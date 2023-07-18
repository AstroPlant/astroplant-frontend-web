import React, { MouseEventHandler, PropsWithChildren } from "react";
import clsx from "clsx";

import commonStyles from "~/Common.module.css";
import styles from "./Button.module.css";

export type ButtonProps = {
  primary?: boolean;
  ok?: boolean;
  cancel?: boolean;
  loading?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function Button({
  primary = false,
  ok = false,
  cancel = false,
  loading = false,
  disabled = false,
  onClick,
  children,
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        styles.btn,
        primary
          ? styles.primary
          : ok
          ? styles.ok
          : cancel
          ? styles.cancel
          : null,
        commonStyles.focusRing,
        loading && styles.loading,
      )}
    >
      {children}
    </button>
  );
}
