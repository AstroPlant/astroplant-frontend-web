import React, { useCallback, useRef } from "react";
import clsx from "clsx";

import style from "./Input.module.css";

export type InputProps = {
  value: string;
  placeholder?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLInputElement>;
  readOnly?: boolean;
  /** A React node to use as an adornment at the left side of the input field. */
  leftAdornment?: React.ReactNode;
  /** A React node to use as an adornment at the right side of the input field. */
  rightAdornment?: React.ReactNode;
  /** Whether the input takes up the full width of its container. */
  fullWidth?: boolean;
};

export function Input({
  value,
  placeholder,
  onChange,
  onClick,
  readOnly,
  leftAdornment,
  rightAdornment,
  fullWidth = false,
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
      value={value}
      readOnly={readOnly}
      placeholder={placeholder}
      onChange={onChange}
      onClick={onClick}
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
