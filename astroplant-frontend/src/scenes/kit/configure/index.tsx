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
      <Message>
        <Message.Header>Kit version</Message.Header>
        <p>
          During this beta testing phase, it is important to regularly check you
          are running the latest kit software. Please check you are running the
          latest version by referring to the{" "}
          <a href="https://astroplant.gitbook.io/join-mission/astroplant-software/software-setup">
            software setup guides
          </a>
          . You can check your current kit version through the RPC system using
          &quot;Query kit version&quot;—if your kit is up and running. You can
          also SSH into your kit and run:
        </p>
        <pre>
          <code>$ astroplant-kit version</code>
        </pre>
      </Message>
      <Switch>
        <Route
          path={`${path}/create`}
          render={(_routeProps) => <Create {...props} />}
        />
        <Route
          path={`${path}/:configurationId`}
          render={(routeProps: any) => <View {...routeProps} />}
        />
        <Route render={(_routeProps) => <List {...props} />} />
      </Switch>
    </Container>
  );
}
