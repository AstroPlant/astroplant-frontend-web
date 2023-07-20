import React, { MouseEventHandler, PropsWithChildren } from "react";
import clsx from "clsx";

import commonStyles from "~/Common.module.css";
import styles from "./Button.module.css";

export type ButtonProps = {
  variant?: "regular" | "primary" | "muted" | "positive" | "negative";
  size?: "regular" | "small";
  loading?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** A React node to use as an adornment at the left side of the button. */
  leftAdornment?: React.ReactNode;
  /** A React node to use as an adornment at the right side of the button. */
  rightAdornment?: React.ReactNode;
};

export function Button({
  variant = "regular",
  size,
  loading = false,
  disabled = false,
  leftAdornment,
  rightAdornment,
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
        variant === "muted" && styles.muted,
        variant === "positive" && styles.ok,
        variant === "negative" && styles.cancel,
        size === "small" && styles.small,
        commonStyles.focusRing,
        loading && styles.loading,
      )}
    >
      {leftAdornment && (
        <div className={styles.leftAdornment}>{leftAdornment}</div>
      )}
      {children}
      {rightAdornment && (
        <div className={styles.rightAdornment}>{rightAdornment}</div>
      )}
    </button>
  );
}
