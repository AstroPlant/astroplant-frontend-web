import React, { useCallback, useRef } from "react";
import clsx from "clsx";

import style from "./Input.module.css";

export type InputProps = React.HTMLProps<HTMLInputElement> & {
  /** A React node to use as an adornment at the left side of the input field. */
  leftAdornment?: React.ReactNode;
  /** A React node to use as an adornment at the right side of the input field. */
  rightAdornment?: React.ReactNode;
  /** Whether the input takes up the full width of its container. */
  fullWidth?: boolean;
};

export function Input({
  leftAdornment,
  rightAdornment,
  fullWidth = false,
  ...props
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // When the input's container is clicked, focus the input element. Only used
  // when the input is internally rendered in a container because of
  // adornments.
  const containerClickCb = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const adorned = leftAdornment !== undefined || rightAdornment !== undefined;
  const input = (
    <input
      {...props}
      ref={inputRef}
      className={clsx(
        style.input,
        !adorned && fullWidth && style.fullWidth,
        adorned && style.adornedInput,
      )}
    />
  );

  if (adorned) {
    return (
      <div
        className={clsx(style.inputContainer, fullWidth && style.fullWidth)}
        onClick={containerClickCb}
      >
        {leftAdornment}
        {input}
        {rightAdornment}
      </div>
    );
  } else {
    return input;
  }
}
