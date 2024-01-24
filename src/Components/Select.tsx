import React, { useCallback, useRef } from "react";
import clsx from "clsx";

import style from "./Select.module.css";

export type SelectProps = React.HTMLProps<HTMLSelectElement> & {
  /** A React node to use as an adornment at the left side of the input field. */
  leftAdornment?: React.ReactNode;
  /** A React node to use as an adornment at the right side of the input field. */
  rightAdornment?: React.ReactNode;
  /** Whether the input takes up the full width of its container. */
  fullWidth?: boolean;
};

export function Select({
  leftAdornment,
  rightAdornment,
  fullWidth = false,
  children,
  ...props
}: SelectProps) {
  const selectRef = useRef<HTMLSelectElement>(null);

  // When the select's container is clicked, focus the select element. Only used
  // when the select is internally rendered in a container because of
  // adornments.
  const containerClickCb = useCallback(() => {
    if (selectRef.current) {
      selectRef.current.focus();
    }
  }, [selectRef]);

  const adorned = leftAdornment !== undefined || rightAdornment !== undefined;
  const select = (
    <select
      {...props}
      ref={selectRef}
      className={clsx(
        style.select,
        !adorned && fullWidth && style.fullWidth,
        adorned && style.adornedSelect,
      )}
    >
      {children}
    </select>
  );

  if (adorned) {
    return (
      <div
        className={clsx(style.selectContainer, fullWidth && style.fullWidth)}
        onClick={containerClickCb}
      >
        {leftAdornment}
        {select}
        {rightAdornment}
      </div>
    );
  } else {
    return select;
  }
}
