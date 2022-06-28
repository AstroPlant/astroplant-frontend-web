import React from "react";
import Option from "../utils/option";

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

export type WithOption<T> = {
  option: Option<T>;
}

export type WithValue<T> = {
  value: T;
}

interface OptionGuardProps<P, T> {
  option: Option<T>;
  some: React.ComponentType<P & WithValue<T>>;
  none?: React.ComponentType<P>;
}

export function OptionGuard<P, T>(props: OptionGuardProps<P, T> & P) {
  const { option, some, none, ...rest } = props;

  // TODO: make this typecheck correctly.
  // @ts-ignore
  const passthrough = rest as P;
  //const None = none as React.ComponentType<P>;

  if (option.isSome()) {
    return <props.some value={option.unwrap()} {...passthrough} />;
    //return null
  } else {
    if (props.none) {
      return <props.none {...passthrough} />;
    } else {
      return null;
    }
  }
};

/**
 * HOC to turn a component taking a value into a component taking an Option.
 *
 * TODO: type inference isn't quite working, often the T type has to be given
 * explicitly.
 *
 * NoneComponent: the component to render if the Option is None.
 */
export function withOption<T, P>(
  NoneComponent?: React.ComponentType<P>
): (
  component: React.ComponentType<P & WithValue<T>>
) => React.ComponentType<P & WithOption<T>> {
  return Component => {
    return props => {
      const { option, ...rest } = props;
      const passthrough = rest as P;

      if (option.isSome()) {
        return <Component {...passthrough} value={option.unwrap()} />;
      } else {
        if (NoneComponent) {
          return <NoneComponent {...passthrough} />;
        } else {
          return null;
        }
      }
    };
  };
}
