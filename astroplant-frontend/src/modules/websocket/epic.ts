import { Epic, combineEpics } from "redux-observable";
import { Observable } from "rxjs";
import {
  mergeMap,
  switchMap,
  filter,
  share,
  map,
  finalize,
  takeUntil,
} from "rxjs/operators";
import { webSocket } from "rxjs/webSocket";
import * as kitActions from "../kit/actions";
import { RawMeasurement } from "../kit/reducer";

const webSocketSubject = webSocket(
  process.env.REACT_APP_WEBSOCKET_URL || "ws://localhost:8080/ws"
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
  const [id, request] = prepareRpcRequest("subscribe_" + method, params);
  webSocketSubject.next(request);
  return webSocketMessages.pipe(
    filter((message: any) => message.id === id),
    switchMap((message: any) => {
      const subId = message.result;
      return webSocketMessages.pipe(
        filter(
          (message: any) =>
            message.method === method && message.params.subscription === subId
        ),
        map((message: any) => message.params.result),
        finalize(() => {
          const [, request] = prepareRpcRequest("unsubscribe_" + method, [
            subId,
          ]);
          webSocketSubject.next(request);
        })
      );
    })
  );
};

/**
 * Listens to notification requests, and add notifications.
 */
const rawMeasurementsEpic: Epic = (action$, state$) =>
  action$.pipe(
    filter(kitActions.startWatching.match),
    mergeMap((action) => {
      const kitSerial = action.payload.serial;
      return rpcSubscription("rawMeasurements", { kitSerial }).pipe(
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
        )
      );
    })
  );

export default combineEpics(rawMeasurementsEpic);
