import { Epic, combineEpics } from "redux-observable";
import { Observable, concat } from "rxjs";
import {
  delay,
  filter,
  finalize,
  map,
  mergeMap,
  retryWhen,
  share,
  switchMap,
  take,
  takeUntil,
  tap,
} from "rxjs/operators";
import { webSocket } from "rxjs/webSocket";
import * as kitActions from "../kit/actions";
import { RawMeasurement } from "../kit/reducer";

const webSocketSubject = webSocket(
  import.meta.env.VITE_WEBSOCKET_URL || "ws://localhost:8080/ws"
);
const webSocketMessages: Observable<any> = webSocketSubject.pipe(share());
let webSocketRequestId = 0;

const prepareRpcRequest = (method: string, params: any) => {
  const nextId = webSocketRequestId++;
  return [
    nextId,
    {
      jsonrpc: "2.0",
      id: nextId,
      method,
      params,
    },
  ];
};

const rpcSubscription = (method: string, params: any) => {
  let id: any;
  return concat(
    new Observable((subscriber) => {
      const [id_, request] = prepareRpcRequest(method, params);
      id = id_;
      try {
        webSocketSubject.next(request);
      } catch (err) {
        subscriber.error(err);
      }
      subscriber.complete();
    }),
    webSocketMessages.pipe(
      filter((message: any) => message.id === id),
      switchMap((message: any) => {
        const subId = message.result;
        return webSocketMessages.pipe(
          filter(
            (message: any) =>
              message.method === method && message.params.subscription === subId
          ),
          map((message: any) => message.params.result),
          // FIXME: When this observable is retried, the unsubscribe message is sent on a _new_ websocket connection.
          finalize(() => {
            const [, request] = prepareRpcRequest("unsubscribe_" + method, [
              subId,
            ]);
            webSocketSubject.next(request);
          })
        );
      })
    )
  );
};

// TODO: why does the connection drop if no messages are sent by the server?
/**
 * Listens to notification requests, and add notifications.
 */
const rawMeasurementsEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(kitActions.startWatching.match),
    mergeMap((action) => {
      const kitSerial = action.payload.serial;
      return rpcSubscription("subscribe_raw_measurements", {
        kit_serial: kitSerial,
      }).pipe(
        map((rawMeasurement) =>
          kitActions.rawMeasurementReceived({
            serial: kitSerial,
            rawMeasurement: rawMeasurement as RawMeasurement,
          })
        ),
        takeUntil(
          action$.pipe(
            filter(kitActions.stopWatching.match),
            filter((action) => action.payload.serial === kitSerial)
          )
        ),
        // Try re-establishing the connection 10 times, waiting 5 seconds each time.
        retryWhen((errors) =>
          errors.pipe(
            tap((err) => console.warn(`WS error: ${err}`)),
            delay(5000),
            take(10)
          )
        )
      );
    })
  );

export default combineEpics(rawMeasurementsEpic);
