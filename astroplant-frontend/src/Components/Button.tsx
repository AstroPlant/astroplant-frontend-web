import React, { MouseEventHandler, PropsWithChildren } from "react";
import clsx from "clsx";

import commonStyles from "~/Common.module.css";
import styles from "./Button.module.css";
import { NavLink, NavLinkProps } from "react-router-dom";

export type ButtonVariant =
  | "regular"
  | "primary"
  | "muted"
  | "positive"
  | "negative"
  | "text";
export type ButtonSize = "regular" | "small";

function className_(
  variant: ButtonVariant = "regular",
  size: ButtonSize = "regular",
  loading: boolean = false,
): string {
  return clsx(
    styles.btn,
    variant === "primary" && styles.primary,
    variant === "muted" && styles.muted,
    variant === "positive" && styles.ok,
    variant === "negative" && styles.cancel,
    variant === "text" && styles.text,
    size === "small" && styles.small,
    commonStyles.focusRing,
    loading && styles.loading,
  );
}

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  /** A React node to use as an adornment at the left side of the button. */
  leftAdornment?: React.ReactNode;
  /** A React node to use as an adornment at the right side of the button. */
  rightAdornment?: React.ReactNode;
};

export type ButtonProps = CommonProps &
  Omit<React.HTMLProps<HTMLButtonElement>, "size"> & {
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
  };

export type ButtonLinkProps = CommonProps & NavLinkProps;

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
      className={clsx(className, className_(variant, size, loading))}
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

export function ButtonLink({
  variant = "regular",
  size,
  loading = false,
  leftAdornment,
  rightAdornment,
  children,
  className,
  ...props
}: PropsWithChildren<ButtonLinkProps>) {
  return (
    <NavLink
      {...props}
      className={clsx(className, className_(variant, size, loading))}
    >
      {leftAdornment && (
        <div className={styles.leftAdornment}>{leftAdornment}</div>
      )}
      {children}
      {rightAdornment && (
        <div className={styles.rightAdornment}>{rightAdornment}</div>
      )}
    </NavLink>
  );
}
