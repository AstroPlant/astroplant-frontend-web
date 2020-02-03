import React from "react";
import { Switch, Route, RouteComponentProps } from "react-router";
import { Container } from "semantic-ui-react";
import { KitState } from "modules/kit/reducer";

import Create from "./create";
import List from "./list";
import View from "./view";


type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params> & {
  kit: KitState;
};

export default function KitConfigure(props: Props) {
  const { kit } = props;
  const { path } = props.match;

  return (
    <Container text>
      <Switch>
        <Route
          path={`${path}/create`}
          render={props => <Create {...props} kit={kit} />}
        />
        <Route
          path={`${path}/:configurationId`}
          render={props => <View {...props} kit={kit} />}
        />
        <Route render={props => <List {...props} kit={kit} />} />
      </Switch>
    </Container>
  );
}
