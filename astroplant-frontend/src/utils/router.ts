import { History } from "history";

/// Move up one directory, e.g. from `a/b/c` to `a/b`.
/// Assumes there are no trailing slashes.
export function upOne(path: string): string {
  return path.substring(0, path.lastIndexOf("/"));
}

export function pushUpOne(history: History) {
  history.push(upOne(history.location.pathname))
}
