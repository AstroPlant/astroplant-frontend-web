import md5 from "md5";
import querystring from "query-string";

import style from "./Gravatar.module.css";
import clsx from "clsx";

type Props = {
  identifier: string;
  size?: number;
  rating?: string;
  default?: string;
  className?: string;
};

const URL_BASE = "//www.gravatar.com/avatar/";

export default function Gravatar({
  identifier,
  size = 350,
  rating = "g",
  default: default_ = "identicon",
  className,
}: Props) {
  const query = querystring.stringify({
    s: size,
    r: rating,
    d: default_,
  });

  const formattedIdentifier = identifier.trim().toLowerCase();
  let hash = md5(formattedIdentifier);

  const src = `${URL_BASE}${hash}?${query}`;

  // Note: gravatars are square
  return (
    <img
      className={clsx(style.gravatar, className)}
      width={size}
      height={size}
      alt={`Gravatar for ${formattedIdentifier}`}
      src={src}
    />
  );
}
