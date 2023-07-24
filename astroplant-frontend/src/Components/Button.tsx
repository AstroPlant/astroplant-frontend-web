import React, { MouseEventHandler, PropsWithChildren } from "react";
import clsx from "clsx";

import commonStyles from "~/Common.module.css";
import styles from "./Button.module.css";

export type ButtonProps = Omit<React.HTMLProps<HTMLButtonElement>, "size"> & {
  variant?: "regular" | "primary" | "muted" | "positive" | "negative" | "text";
  size?: "regular" | "small";
  loading?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** A React node to use as an adornment at the left side of the button. */
  leftAdornment?: React.ReactNode;
  /** A React node to use as an adornment at the right side of the button. */
  rightAdornment?: React.ReactNode;
};

export function Buttons({ children }: PropsWithChildren<{}>) {
  return <div className={styles.buttonGroup}>{children}</div>;
}

export function Button({
  variant = "regular",
  size,
  loading = false,
  disabled = false,
  leftAdornment,
  rightAdornment,
  onClick,
  children,
  className,
  ...props
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      {...props}
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        className,
        styles.btn,
        variant === "primary" && styles.primary,
        variant === "muted" && styles.muted,
        variant === "positive" && styles.ok,
        variant === "negative" && styles.cancel,
        variant === "text" && styles.text,
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
