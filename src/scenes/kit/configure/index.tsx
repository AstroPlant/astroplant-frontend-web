import React from "react";
import { Switch, Route, RouteComponentProps } from "react-router";
import { Container, Loader } from "semantic-ui-react";
import { KitState } from "modules/kit/reducer";

import Create from "./create";
import List from "./list";
import View from "./view";

type Params = { kitSerial: string };

export type Props = RouteComponentProps<Params> & {
  kitState: KitState;
};

export default function KitConfigure(props: Props) {
  const { kitState } = props;
  const { path } = props.match;

  if (kitState.configurations.isNone()) {
    return (
      <Container>
        <Loader active />
      </Container>
    );
  } else {
    return (
      <Container text>
        <Switch>
          <Route
            path={`${path}/create`}
            render={props => (
              <Create {...props} kit={kitState.details.unwrap()} />
            )}
          />
          <Route
            path={`${path}/:configurationId`}
            render={props => <View {...props} kitState={kitState} />}
          />
          <Route render={props => <List {...props} kitState={kitState} />} />
        </Switch>
      </Container>
    );
  }
}
