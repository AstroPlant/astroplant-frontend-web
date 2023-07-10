import { ApiEndpointQuery } from "@reduxjs/toolkit/dist/query/core/module";
import {
  QueryArgFrom,
  ResultTypeFrom,
} from "@reduxjs/toolkit/dist/query/endpointDefinitions";
import {
  BaseQueryApi,
  QueryDefinition,
  createApi,
  retry,
} from "@reduxjs/toolkit/query/react";
import { Kit } from "~/../../astroplant-api";
import { selectAuth } from "~/modules/auth/reducer";
import { AppDispatch } from "~/store";
import { RootState } from "~/types";
import { components } from "../api/schema";
import { ThunkAction } from "@reduxjs/toolkit";
import { QueryActionCreatorResult } from "@reduxjs/toolkit/dist/query/core/buildInitiate";
import { QueryResultSelectorResult } from "@reduxjs/toolkit/dist/query/core/buildSelectors";
import {
  Api,
  HttpHeaders,
  Meta,
  RequestOptions,
  ErrorResponse,
  encodeUri,
  ErrorDetails,
} from "~/api";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { firstValueFrom } from "rxjs";
export type schemas = components["schemas"];

export type HttpQuery = {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | Array<string | number | null | boolean>;
};

const unwrappedApi = new Api();

async function baseQueryFn(
  args: RequestOptions,
  api: BaseQueryApi,
  _extraOptions: {}
): Promise<QueryReturnValue<unknown, ErrorDetails, Meta<unknown>>> {
  const auth = selectAuth(api.getState() as RootState);
  let headers: HttpHeaders = auth.accessToken
    ? { Authorization: `Bearer: ${auth.accessToken}` }
    : {};
  headers = { ...headers, ...args.headers };

  try {
    const response = await firstValueFrom(
      unwrappedApi.request({ headers, ...args })
    );
    console.warn("response", response);
    return await firstValueFrom(unwrappedApi.request({ headers, ...args }));
  } catch (e) {
    if (e instanceof ErrorResponse) {
      return { error: e.details, meta: e.meta };
    } else {
      throw new Error("An unexpected error occurred");
    }
  }
}

const baseQueryWithRetry = retry(baseQueryFn);

/** A Redux Toolkit wrapper around the AstroPlant API implementation. Provides
 * some utilities such as hooks and  caching. */
export const rtkApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithRetry,
  endpoints: (build) => ({
    listKits: build.query<Kit[], void>({
      async queryFn(_arg, api, _baseQuery) {
        const auth = selectAuth(api.getState() as RootState);
        let headers: HttpHeaders = auth.accessToken
          ? { Authorization: `Bearer: ${auth.accessToken}` }
          : {};
        try {
          return await firstValueFrom(unwrappedApi.listKits(headers));
        } catch (e) {
          if (e instanceof ErrorResponse) {
            return { error: e.details, meta: e.meta };
          } else {
            throw new Error("An unexpected error occurred");
          }
        }
      },
    }),
    listMedia: build.query<
      Array<schemas["Media"]>,
      {
        kitSerial: string;
        configuration?: number;
        peripheral?: number;
      }
    >({
      query: ({ kitSerial, ...params }) => ({
        path: `/kits/${encodeUri(kitSerial)}/media`,
        method: "GET",
        query: params,
      }),
    }),
    getArchiveDownloadToken: build.query<
      string,
      /** kitSerial: */
      string
    >({
      query: (kitSerial) => ({
        path: `/kits/${encodeUri(kitSerial)}/archive`,
        method: "POST",
      }),
    }),
  }),
});

export async function dispatchQueryOneOff<
  D extends QueryDefinition<any, any, any, any>
>(
  dispatch: AppDispatch,
  query: ThunkAction<QueryActionCreatorResult<D>, any, any, any>
): Promise<QueryResultSelectorResult<D>> {
  const result = dispatch(query);
  const res = await result;
  result.unsubscribe();
  return res;
}

/** Walk over all cursors of an endpoint using closures to transform arguments
 * and results.
 *
 * @param endpoint The endpoint to walk over cursors for.
 * @param argsForCursor Closure generating the argument to give to the
 * endpoint for the given cursor. The first cursor is undefined. @param
 * convertResult Closure converting the endpoint's result to an array of items
 * and cursor pointing to the next items. If the next cursor is undefined, we
 * stop walking cursors.
 */
export async function baseWalkCursors<
  D extends QueryDefinition<any, any, any, any>,
  T
>(
  dispatch: AppDispatch,
  endpoint: ApiEndpointQuery<D, any>,
  argsForCursor: (cursor?: string) => QueryArgFrom<D>,
  convertResult: (result: ResultTypeFrom<D>) => {
    items: T[];
    nextCursor?: string;
  },
  maxRequests: number = 20
): Promise<T[]> {
  let collected: T[] = [];

  let cursor = undefined;
  for (let request = 0; request < maxRequests; request++) {
    const args = argsForCursor(cursor);
    const query = dispatch(endpoint.initiate(args));
    try {
      const result = await query;

      if (result.data !== undefined) {
        const { items, nextCursor } = convertResult(result.data);
        cursor = nextCursor;
        collected = collected.concat(items);
      } else {
        cursor = undefined;
      }
    } finally {
      query.unsubscribe();
    }

    if (cursor === undefined) {
      break;
    }
  }

  return collected;
}

export type WalkCursorReturnType<
  D extends QueryDefinition<any, any, any, any>
> = ResultTypeFrom<D> extends {
  items: (infer ResultItem)[];
  nextAfter?: string;
}
  ? ResultItem[]
  : unknown[];

/** Walk over all cursors of an endpoint. The endpoint is assumed to take an
 * object as argument with an "after" entry taking a number. The endpoint is
 * assumed to return data as an object of the form
 *
 * ```ts { items, nextAfter? } ```
 *
 * where items is an array of the items to collect and nextCursor (optionally)
 * points to the next cursor.
 */
export function walkCursors<
  Args extends object,
  D extends QueryDefinition<Args & { after?: string }, any, any, any>
>(
  dispatch: AppDispatch,
  endpoint: ApiEndpointQuery<D, any>,
  args: Args,
  maxRequests: number = 20
): Promise<WalkCursorReturnType<D>> {
  // TODO: this currently doesn't fail typechecking endpoints that don't return
  // an object with `{ items, nextafter? }` (though it does infer types
  // correctly for those that do return values of that form).
  return baseWalkCursors(
    dispatch,
    endpoint,
    (cursor) => ({ ...args, after: cursor } as QueryArgFrom<D>),
    (result) => ({ items: result.items, nextCursor: result.nextAfter }),
    maxRequests
  ) as Promise<WalkCursorReturnType<D>>;
}