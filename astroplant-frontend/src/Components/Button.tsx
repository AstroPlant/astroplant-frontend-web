import React, { MouseEventHandler, PropsWithChildren } from "react";
import clsx from "clsx";

import commonStyles from "~/Common.module.css";
import styles from "./Button.module.css";

export type ButtonProps = {
  variant?: "regular" | "primary" | "positive" | "negative";
  loading?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function Button({
  variant = "regular",
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
        variant === "primary" && styles.primary,
        variant === "positive" && styles.ok,
        variant === "negative" && styles.cancel,
        commonStyles.focusRing,
        loading && styles.loading,
      )}
    >
      {children}
    </button>
  );
}
