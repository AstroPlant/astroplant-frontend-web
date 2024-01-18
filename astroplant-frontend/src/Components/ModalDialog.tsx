import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import style from "./ModalDialog.module.css";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

export type ModalDialogProps = {
  /** Whether the modal dialog is open. */
  open?: boolean;
  /** Called when the modal dialog should be closed (from a modal-fired event). */
  onClose: () => unknown;
  header?: React.ReactNode;
  actions?: React.ReactNode;
};

export function ModalDialog({
  open = false,
  onClose,
  header,
  actions,
  children,
}: PropsWithChildren<ModalDialogProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const innerOnClose: React.ReactEventHandler<HTMLDialogElement> = useCallback(
    (e) => {
      e.preventDefault();
      onClose();
    },
    [onClose],
  );

  const onCancel: React.ReactEventHandler<HTMLDialogElement> = useCallback(
    (e) => {
      e.preventDefault();
      onClose();
    },
    [onClose],
  );

  // Trigger closing when we click out of the modal.
  const onClick: React.ReactEventHandler<HTMLDialogElement> = useCallback(
    (e) => {
      if (e.target === dialogRef.current) {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [dialogRef, open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={innerOnClose}
      onCancel={onCancel}
      onClick={onClick}
      className={style.dialog}
    >
      {/* this div is used for the "click-outside" handler */}
      <div>
        {header && <header className={style.header}>{header}</header>}
        <section className={style.content}>{children}</section>
        {actions && <section className={style.actions}>{actions}</section>}
      </div>
    </dialog>
  );
}

export type ModalConfirmDialogProps = {
  /** Whether the modal dialog is open. */
  open?: boolean;
  /** Called when the modal dialog should be closed through a confirmation
   * action (from a modal-fired event). */
  onConfirm: () => unknown;
  /** Called when the modal dialog should be closed through a cancellation action (from a modal-fired event). */
  onCancel: () => unknown;
  confirmLabel?: string;
  cancelLabel?: string;
  header?: string;
};

export function ModalConfirmDialog({
  open = false,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
  header,
  children,
}: PropsWithChildren<ModalConfirmDialogProps>) {
  const { t } = useTranslation();

  return (
    <ModalDialog
      open={open}
      onClose={onCancel}
      header={header ? header : t("common.confirm")}
      actions={
        <>
          <Button variant="negative" onClick={() => onCancel()}>
            {confirmLabel ? cancelLabel : t("common.cancel")}
          </Button>
          <Button variant="primary" onClick={() => onConfirm()}>
            {confirmLabel ? confirmLabel : t("common.ok")}
          </Button>
        </>
      }
    >
      {children}
    </ModalDialog>
  );
}

export type UseModalConfirmDialogValue = {
  element: React.ReactNode;
  confirmed: boolean;
  trigger: ({
    header,
    body,
  }: {
    header?: string;
    body?: React.ReactNode;
  }) => Promise<boolean>;
  isOpen: boolean;
};

/**
 * A hook to imperatively trigger a modal confirm dialog.
 *
 * Calling `trigger` shows the dialog. It returns a promise that resolve to
 * whether the dialog was confirmed or not. If `trigger` is called with a
 * dialog still outstanding, the previous call to `trigger` resolves to false.
 *
 * Example:
 *
 * ```tsx
 * const { element, trigger } = useModalConfirmDialog();
 * const someCallback = (async () => {
 *   const confirmed = await trigger({header: "Are you sure?", body: <>Please confirm.</>});
 *   if (confirmed) {
 *     // do something
 *   }
 * });
 * return <>{element}{otherChildren}</>
 * ```
 */
export function useModalConfirmDialog(): UseModalConfirmDialogValue {
  const [confirmed, setConfirmed] = useState(false);
  const [open, setOpen] = useState(false);
  const [resolve, setResolve] = useState<
    ((value: boolean | PromiseLike<boolean>) => void) | null
  >(null);

  const [content, setContent] = useState<{
    header?: string;
    body?: React.ReactNode;
  }>({});

  const trigger = useMemo(() => {
    return (content: { header?: string; body?: React.ReactNode }) => {
      setConfirmed(false);
      setOpen(true);
      const p = new Promise<boolean>((resolve_, _reject) => {
        // Use a lambda here, because `setResolve` accepts either new state or
        // a function taking state and returning new state. If passed a
        // function, `setResolve` calls it.
        setResolve(() => resolve_);
      });
      setContent(content);
      return p;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (resolve !== null) {
        // Cancel outstanding request. This is a no-op if resolve was already called.
        resolve(false);
      }
    };
  }, [resolve]);

  const element = (
    <ModalConfirmDialog
      open={open}
      onConfirm={() => {
        if (resolve) {
          resolve(true);
        }
        setConfirmed(true);
        setOpen(false);
        setResolve(null);
      }}
      onCancel={() => {
        if (resolve) {
          resolve(false);
        }
        setOpen(false);
        setResolve(null);
      }}
      header={content.header}
    >
      {content.body}
    </ModalConfirmDialog>
  );

  return { element, confirmed, trigger, isOpen: open };
}
