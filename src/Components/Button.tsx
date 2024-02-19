import React, {
  MouseEvent,
  MouseEventHandler,
  PropsWithChildren,
  useState,
} from "react";
import { NavLink, NavLinkProps } from "react-router-dom";
import clsx from "clsx";

import commonStyles from "~/Common.module.css";
import styles from "./Button.module.css";
import { ModalConfirmDialog } from "./ModalDialog";

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
  Omit<React.ComponentProps<"button">, "size"> & {
    disabled?: boolean;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    confirm?: () => {
      content: { header: string; body: React.ReactNode };
    } | null;
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
  confirm,
  children,
  className,
  ...props
}: PropsWithChildren<ButtonProps>) {
  const [confirmContent, setConfirmContent] = useState<{
    header: string;
    body: React.ReactNode;
  } | null>(null);
  const [capturedEvent, setCapturedEvent] =
    useState<MouseEvent<HTMLButtonElement> | null>(null);

  // Be careful: `ModalConfirmDialog` internally uses `Button` (which is us).
  // `ModalConfirmDialog` has to be conditionally rendered here, otherwise
  // infinite recursion results.
  return (
    <>
      {confirm !== undefined && (
        <ModalConfirmDialog
          open={confirmContent !== null}
          header={confirmContent?.header}
          onConfirm={() => {
            setConfirmContent(null);
            setCapturedEvent(null);

            if (onClick !== undefined) {
              onClick(capturedEvent!);
            }
          }}
          onCancel={() => setConfirmContent(null)}
        >
          {confirmContent?.body}
        </ModalConfirmDialog>
      )}
      <button
        {...props}
        onClick={(e) => {
          if (confirm !== undefined && confirm !== null) {
            const confirmContent_ = confirm()?.content ?? {
              header: "Are you sure?",
              body: "Please confirm you wish to continue.",
            };
            setConfirmContent(confirmContent_);
            setCapturedEvent(e);
          } else {
            if (onClick !== undefined) {
              onClick(e);
            }
          }
        }}
        disabled={disabled}
        className={clsx(className, className_(variant, size, loading))}
      >
        {leftAdornment && (
          <div className={styles.leftAdornment}>{leftAdornment}</div>
        )}
        {leftAdornment || rightAdornment ? <span>{children}</span> : children}
        {rightAdornment && (
          <div className={styles.rightAdornment}>{rightAdornment}</div>
        )}
      </button>
    </>
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
