import React from "react";
import { Switch, Route, RouteComponentProps } from "react-router";

type Params = { kitId: string };

export type Props = RouteComponentProps<Params>;

export default function Kit(props: Props) {
  const { kitId } = props.match.params;
  const { path } = props.match;

  return (
    <>
      {kitId}-{path}
      <Switch>
        <Route path={`${path}/configure`}>Asd</Route>
      </Switch>
    </>
  );
}
