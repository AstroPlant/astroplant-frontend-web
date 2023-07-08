/**
 * Currently there are two API client implementations living side-by-side in this codebase:
 * ./local_modules/astroplant-api, which is automatically generated, and the implementation
 * here, which is created manually.
 *
 * This manual implementation provides more features, such as utilities for following pages
 * in Link headers. However, this implementation does not yet provide all endpoints and its
 * interface is subject to change.
 *
 * The intention is to, over time, complete this manual implementation and remove the
 * implementation at ./local_modules/astroplant-api.
 */

import parseLinkHeader from "parse-link-header";
import { Observable } from "rxjs";
import { ajax, AjaxError, AjaxRequest, AjaxResponse } from "rxjs/ajax";
import { catchError, map, reduce } from "rxjs/operators";
import { DateTime } from "luxon";

import { components } from "./schema";
import { store } from "~/store";
import { selectAuth } from "~/modules/auth/reducer";
export type schemas = components["schemas"];

export const BASE_PATH =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface ConfigurationParameters {
  /** Override base path */
  basePath?: string;
  /** The access token to be given in the Authorization header. */
  accessToken?: string | (() => string | null);
}

export class Configuration {
  constructor(private configuration: ConfigurationParameters = {}) {}

  get basePath(): string {
    return this.configuration.basePath || BASE_PATH;
  }

  get accessToken(): () => string | null {
    const accessToken = this.configuration.accessToken;
    if (!accessToken) {
      return () => null;
    }
    return typeof accessToken === "string" ? () => accessToken : accessToken;
  }
}

/** Original query request meta information. This is part of the HTTP request
 * sent to the API.
 */
export type RequestMeta = {
  url?: string;
  body?: any;
  method?: string;
  headers?: Object;
};

/** Query response meta information, derived from the HTTP response by the API. */
export type ResponseMeta<T> = {
  /** The HTTP status code. [200,299] indicates success. */
  status: number;
  /** The response content media type, e.g., `application/json`. */
  mediaType: string | null;

  /** Whether the resource requested has a next page. (Such as the continuation
   * of a collection of items.) */
  hasNext: boolean;
  /** The URI of the next page if any. */
  uriNext: string | null;
  /** An observable to the result of the next page if any. */
  next: Observable<Response<T>> | null;
};

/** Query meta information. */
export type Meta<T> = {
  request: RequestMeta;
  response?: ResponseMeta<T>;
};

/** The response type of a succesful query. */
export type Response<T> = {
  /** The data returned by the query (probably a string, object, Blob, ...) */
  data: T;

  /** Query meta information. */
  meta: Meta<T>;
};

// TODO: add ProblemDetails application-level error
export type ErrorDetails =
  | {
      type: "AJAX";
    }
  | {
      type: "TIMEOUT";
      error?: string;
    }
  | {
      type: "OTHER";
      error?: string;
      data?: string;
      status: number;
    };

export class ErrorResponse extends Error {
  readonly details: ErrorDetails;
  readonly meta: Meta<never>;

  constructor(details: ErrorDetails, meta: Meta<never>) {
    super("An API error occurred");
    Object.setPrototypeOf(this, ErrorResponse.prototype);

    this.details = details;
    this.meta = meta;
  }
}

function processRequestMeta(ajaxRequest: AjaxRequest): RequestMeta {
  return {
    url: ajaxRequest.url,
    body: ajaxRequest.body,
    method: ajaxRequest.method,
    headers: ajaxRequest.headers,
  };
}

function processResponse<T = unknown>(
  api: BaseApi,
  ajaxResponse: AjaxResponse
): Response<T> {
  const data = ajaxResponse.response;

  const status = ajaxResponse.status;
  const mediaType = ajaxResponse.xhr.getResponseHeader("content-type");

  const requestMeta = processRequestMeta(ajaxResponse.request);

  const link = ajaxResponse.xhr.getResponseHeader("link");
  let uriNext = null;
  if (link !== null) {
    const parsed = parseLinkHeader(link);
    uriNext = parsed?.next?.url ?? null;
  }

  const partialResponseMeta = {
    status,
    mediaType,
    hasNext: uriNext !== null,
    uriNext,
  };

  const responseMeta: ResponseMeta<T> = {
    ...partialResponseMeta,
    // is it correct that we always GET?
    next: uriNext !== null ? api.getPath<T>(uriNext) : null,
  };

  const errorResponseMeta: ResponseMeta<never> = {
    ...partialResponseMeta,
    next: null,
  };

  const meta: Meta<T> = { request: requestMeta, response: responseMeta };
  const errorMeta: Meta<never> = {
    request: requestMeta,
    response: errorResponseMeta,
  };

  if (status >= 200 && status < 300) {
    return {
      data,
      meta,
    };
  } else {
    throw new ErrorResponse(
      {
        type: "OTHER",
        status,
        data: ajaxResponse.responseText,
      },
      errorMeta
    );
  }
}

export class BaseApi {
  constructor(protected configuration = new Configuration()) {}

  private createRequestArguments = (options: RequestOptions): any => {
    let url = this.configuration.basePath + options.path;

    if (
      options.query !== undefined &&
      Object.keys(options.query).length !== 0
    ) {
      url += "?" + queryString(options.query);
    }

    let headers: HttpHeaders = {
      ...options.headers,
      ...(options.body === undefined
        ? {}
        : { "Content-Type": "application/json" }),
    };

    const accessToken = this.configuration.accessToken();
    if (accessToken !== null) {
      headers = { ...headers, Authorization: `Bearer ${accessToken}` };
    }

    return {
      url,
      method: options.method,
      headers,
      body: JSON.stringify(options.body),
      responseType: options.responseType || "json",
    };
  };

  /**
   * @throws {ErrorResponse}
   */
  request = <T = unknown>(options: RequestOptions): Observable<Response<T>> => {
    return ajax(this.createRequestArguments(options)).pipe(
      catchError((err_) => {
        const err = err_ as AjaxError;
        const meta = { request: processRequestMeta(err.request) };
        throw new ErrorResponse({ type: "AJAX" }, meta);
      }),
      map((res) => {
        return processResponse(this, res);
      })
    );
  };

  /**
   * @throws {ErrorResponse}
   */
  getPath = <T = unknown>(url: string): Observable<Response<T>> => {
    return this.request({ path: url, method: "GET" });
  };
}

/**
 * A client implementation of the AstroPlant API.
 */
export class Api extends BaseApi {
  /**
   * @throws {ErrorResponse}
   */
  listKits = (
    headers: HttpHeaders
  ): Observable<Response<Array<schemas["Kit"]>>> => {
    return this.request<Array<schemas["Kit"]>>({
      path: "/kits",
      method: "GET",
      headers,
    }).pipe(
      reduce((acc, val) => {
        if (acc !== undefined) {
          val.data = acc.data!.concat(val.data!);
        }
        return val;
      })
    );
  };

  /**
   * @throws {ErrorResponse}
   */
  listAggregateMeasurements = ({
    kitSerial,
    ...query
  }: {
    kitSerial: string;
    configuration?: number;
    peripheral?: number;
    quantityType?: number;
  }): Observable<Response<Array<schemas["AggregateMeasurement"]>>> => {
    return this.request<Array<schemas["AggregateMeasurement"]>>({
      path: `/kits/${encodeUri(kitSerial)}/aggregate-measurements`,
      method: "GET",
      query: query as HttpQuery,
    });
  };

  /**
   * @throws {ErrorResponse}
   */
  listMedia = ({
    kitSerial,
    ...query
  }: {
    kitSerial: string;
    configuration?: number;
    peripheral?: number;
  }): Observable<Response<Array<schemas["Media"]>>> => {
    return this.request<Array<schemas["Media"]>>({
      path: `/kits/${encodeUri(kitSerial)}/media`,
      method: "GET",
      query: query as HttpQuery,
    });
  };

  /**
   * @throws {ErrorResponse}
   */
  getMediaContent = ({
    mediaId,
  }: {
    mediaId: string;
  }): Observable<Response<Blob>> => {
    return this.request<Blob>({
      path: `/media/${encodeUri(mediaId)}/content`,
      method: "GET",
      responseType: "blob",
    });
  };

  downloadMediaContent = ({ mediaId }: { mediaId: string }) => {
    // TODO: get temporary download token from API.
    //
    // this.download({
    //   path: `/media/${encodeUri(mediaId)}/content`,
    //   method: "GET",
    // });
  };

  /**
   * @throws {ErrorResponse}
   */
  getArchiveDownloadToken = ({
    kitSerial,
  }: {
    kitSerial: string;
  }): Observable<Response<string>> => {
    return this.request<string>({
      path: `/kits/${encodeUri(kitSerial)}/archive`,
      method: "POST",
    });
  };

  constructArchiveDownloadLink = ({
    kitSerial,
    token,
    configurationId,
    from,
    to,
  }: {
    kitSerial: string;
    token: string;
    configurationId?: number;
    from?: DateTime;
    to?: DateTime;
  }): string | null => {
    let url = `${this.configuration.basePath}/kits/${encodeUri(
      kitSerial
    )}/archive`;

    let query = {};

    query = { token, ...query };

    if (
      configurationId === undefined &&
      (from === undefined || to === undefined)
    ) {
      return null;
    }

    if (configurationId !== undefined) {
      query = { configuration: configurationId, ...query };
    }

    if (from !== undefined) {
      query = { from: from.toISO(), ...query };
    }

    if (to !== undefined) {
      query = { to: to.toISO(), ...query };
    }

    url += "?" + queryString(query);

    return url;
  };

  /**
   * @throws {ErrorResponse}
   */
  peripheralCommand = ({
    kitSerial,
    peripheral,
    command,
  }: {
    kitSerial: string;
    peripheral: string;
    command: string;
  }): Observable<Response<Blob>> => {
    return this.request<Blob>({
      path: `/kit-rpc/${encodeUri(kitSerial)}/peripheral-command`,
      method: "POST",
      body: { peripheral, command },
      responseType: "blob",
    });
  };
}

/** API configuration automatically fetching the access token from the store. */
const configuration = new Configuration({
  accessToken: () => {
    return selectAuth(store.getState()).accessToken;
  },
});

/** A global API instantiation. It automatically injects the authorization
 * access token fetched from the root store. */
export const api = new Api(configuration);

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "OPTIONS";
export type HttpHeaders = { [key: string]: string };
export type HttpQuery = {
  [key: string]:
    | string
    | number
    | boolean
    | null
    | Array<string | number | null | boolean>;
};
export type HttpBody = any;

export interface RequestOptions {
  path: string;
  method: HttpMethod;
  headers?: HttpHeaders;
  query?: HttpQuery;
  body?: HttpBody;
  responseType?: string;
}

export const encodeUri = (value: any) => encodeURIComponent(String(value));

const queryString = (params: HttpQuery): string =>
  Object.keys(params)
    .map((key) => {
      const value = params[key];
      return value instanceof Array
        ? value.map((val) => `${encodeUri(key)}=${encodeUri(val)}`).join("&")
        : `${encodeUri(key)}=${encodeUri(value)}`;
    })
    .join("&");
