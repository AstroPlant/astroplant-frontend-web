import React, { useCallback, useRef } from "react";
import clsx from "clsx";

import style from "./Textarea.module.css";

export type TextareaProps = React.HTMLProps<HTMLTextAreaElement> & {
  /** A React node to use as an adornment at the left side of the textarea. */
  leftAdornment?: React.ReactNode;
  /** A React node to use as an adornment at the right side of the textarea. */
  rightAdornment?: React.ReactNode;
  /** Whether the textarea takes up the full width of its container. */
  fullWidth?: boolean;
};

export function Textarea({
  leftAdornment,
  rightAdornment,
  fullWidth = false,
  rows = 7,
  ...props
}: TextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // When the textarea's container is clicked, focus the textarea element. Only
  // used when the textarea is internally rendered in a container because of
  // adornments.
  const containerClickCb = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [textareaRef]);

  const adorned = leftAdornment !== undefined || rightAdornment !== undefined;
  const textarea = (
    <textarea
      {...props}
      ref={textareaRef}
      className={clsx(
        style.textarea,
        !adorned && fullWidth && style.fullWidth,
        adorned && style.adorned,
      )}
      rows={rows}
    />
  );

  if (adorned) {
    return (
      <div
        className={clsx(style.textContainer, fullWidth && style.fullWidth)}
        onClick={containerClickCb}
      >
        {leftAdornment}
        {textarea}
        {rightAdornment}
      </div>
    );
  } else {
    return textarea;
  }
}
