import { ComponentClass, ComponentType } from "react";

interface ComponentEnhancer<TInner, TOutter> {
  (component: ComponentType<TInner>): ComponentClass<TOutter>;
}

export default function compose<TInner, TOutter>(
  ...functions: Function[]
): ComponentEnhancer<TInner, TOutter> {
  // From:
  // https://github.com/acdlite/recompose/blob/3db12ce7121a050b533476958ff3d66ded1c4bb8/src/packages/recompose/compose.js
  // @ts-ignore
  return functions.reduce(
    (a, b) =>
      // @ts-ignore
      (...args) =>
        a(b(...args)),
    // @ts-ignore
    (arg) => arg
  );
}
