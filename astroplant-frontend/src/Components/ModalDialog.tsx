import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
} from "react";

import style from "./ModalDialog.module.css";
import { Button } from "./Button";
import { useTranslation } from "react-i18next";

export type ModalDialogProps = {
  /** Whether the modal dialog is open. */
  open?: boolean;
  /** Called when the modal dialog should be closed (from a modal-fired event). */
  onClose: () => unknown;
};

export function ModalDialog({
  open = false,
  onClose,
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
      <div>{children}</div>
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
    <ModalDialog open={open} onClose={onCancel}>
      <header className={style.confirmationHeader}>
        <h1>{header ? header : t("common.confirm")}</h1>
      </header>
      <section className={style.confirmationQuery}>{children}</section>
      <section className={style.confirmationButtons}>
        <Button variant="negative" onClick={() => onCancel()}>
          {confirmLabel ? cancelLabel : t("common.cancel")}
        </Button>
        <Button variant="primary" onClick={() => onConfirm()}>
          {confirmLabel ? confirmLabel : t("common.ok")}
        </Button>
      </section>
    </ModalDialog>
  );
}