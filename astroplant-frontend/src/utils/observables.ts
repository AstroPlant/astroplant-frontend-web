import { Observable, EMPTY, concat, of } from "rxjs";
import { mergeMap } from "rxjs/operators";

/**
 * Recurse over observables, using a function to create observables.
 */
export function recurse<T>(
  nextRequest: (result?: T) => Observable<T> | null,
  result?: T,
): Observable<T> {
  const obs = nextRequest(result);
  if (obs !== null) {
    return obs.pipe(
      mergeMap((result) => concat(of(result), recurse(nextRequest, result))),
    );
  } else {
    return EMPTY;
  }
}
