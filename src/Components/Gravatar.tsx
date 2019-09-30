import React, { Component } from "react";
import md5 from "md5";
import querystring from "query-string";

type Props = {
  identifier: string
  size?: number,
  rating?: string,
  default?: string,
}

class Gravatar extends Component<Props> {
  base = "//www.gravatar.com/avatar/";

  render() {
    const query = querystring.stringify({
      s: this.props.size || 350,
      r: this.props.rating || "g",
      d: this.props.default || "identicon",
    });

    const formattedIdentifier = this.props.identifier.trim().toLowerCase();
    let hash = md5(formattedIdentifier);

    const src = `${this.base}${hash}?${query}`;
    return <img alt={`Gravatar for ${formattedIdentifier}`} src={src} />
  }
}

export default Gravatar;
