import clsx from "clsx";
import style from "./Badge.module.css";

export type BadgeProps = {
  text: string;
  variant?: "regular" | "muted";
  size?: "regular" | "small";
};

/** A badge. Useful for labeling. */
export function Badge({ text, variant, size }: BadgeProps) {
  return (
    <span
      className={clsx(
        style.label,
        variant === "muted" && style.muted,
        size === "small" && style.small,
      )}
    >
      {text}
    </span>
  );
}
