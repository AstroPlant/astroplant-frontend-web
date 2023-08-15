import React, { useCallback, useContext, useId, useRef } from "react";
import clsx from "clsx";
import { IconX } from "@tabler/icons-react";
import { Link, LinkProps } from "react-router-dom";

import { Button } from "./Button";

import style from "./DropdownDetails.module.css";

export const DropdownDetailsCloseContext = React.createContext<() => void>(
  () => {},
);

export type DropdownDetailsProps = {
  /** The class name to set on the menu content container. */
  className?: string;
  /** An icon shown in the summary (thi sis the "button" to open the dropdown) */
  icon?: React.ReactNode;
  /** The label shown in the summary (this is the "button" to open the
   * dropdown) */
  label: React.ReactNode;
  /** The descriptive title of this dropdown (what does it do?) */
  title: string;
  /** The header shown when this dropdown is open. If omitted, the title is
   * used. */
  header?: string;
  /** Whether to anchor the opened menu to the left or right of the summary */
  anchor?: "left" | "right";
  children?: React.ReactNode;
};

/**
 * A dropdown component. Rendered using the <details> disclosure element. The
 * content is shown when the label (aka summary) is pressed.
 *
 * Use the DropdownDetails.Link component to create a link that automatically
 * closes the dropdown content on click.
 */
export function DropdownDetails({
  className,
  icon,
  label,
  title,
  header,
  anchor = "left",
  children,
}: DropdownDetailsProps) {
  const id = useId();

  const details = useRef<HTMLDetailsElement>(null);

  const close = useCallback(() => {
    details.current?.removeAttribute("open");
  }, [details]);

  return (
    <DropdownDetailsCloseContext.Provider value={close}>
      <details id={id} ref={details} className={style.dropdown}>
        <summary className={style.button} title={title}>
          {icon && icon}
          {label}
        </summary>
        <div className={clsx(style.menu, anchor === "right" && style.right)}>
          <header>
            <span>{header ?? title}</span>
            <Button
              variant="text"
              aria-label="Close the menu"
              aria-controls={id}
              onClick={close}
            >
              <IconX size="1em" aria-hidden />
            </Button>
          </header>
          <div className={clsx(style.content, className)}>{children}</div>
        </div>
      </details>
    </DropdownDetailsCloseContext.Provider>
  );
}

/**
 * A react-router-dom `Link` that automatically closes the dropdown when
 * clicked.
 * */
function DropdownDetailsLink(props: LinkProps) {
  const close = useContext(DropdownDetailsCloseContext);

  return (
    <Link
      {...props}
      onClick={(...args) => {
        props.onClick?.(...args);
        close();
      }}
    />
  );
}

DropdownDetails.Link = DropdownDetailsLink;
