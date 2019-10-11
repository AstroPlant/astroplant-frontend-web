import React from "react";
import { Switch, Route, RouteComponentProps } from "react-router";
import { Link } from "react-router-dom";
import { Container } from "semantic-ui-react";
import { KitState } from "modules/kit/reducer";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params> & {
  kit: KitState;
};

export default function KitConfigure(props: Props) {
  const { kit } = props;
  const { path, url } = props.match;

  return (
    <Container text>
      <p>
        <Link to={`${url}/create`}>Create a new configuration.</Link>
      </p>
      Configuration list for {kit.details.name || kit.details.serial}
    </Container>
  );
}
