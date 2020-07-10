import React from "react";
import { Switch, Route, RouteComponentProps } from "react-router";
import { Container, Message } from "semantic-ui-react";

import Create from "./create";
import List from "./list";
import View from "./view";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params>;

export default function KitConfigure(props: Props) {
  const { path } = props.match;

  return (
    <Container>
      <Switch>
        <Route
          path={`${path}/create`}
          render={(props) => <Create {...props} />}
        />
        <Route
          path={`${path}/:configurationId`}
          render={(props) => <View {...props} />}
        />
        <Route render={(props) => <List {...props} />} />
      </Switch>
    </Container>
  );
}
