import React from "react";

/**
 * HOC to map to a component's props from different props.
 */
export function propsMap<PInner extends object, POuter extends object>(
  map: (props: POuter) => PInner,
): (component: React.ComponentType<PInner>) => React.ComponentType<POuter> {
  return (Component) => {
    return (props) => <Component {...map(props)} />;
  };
}
