/**
 * This is the AstroPlant API client implementation. It provides utilities such
 * as recursively following pages in Link headers. API requests return an
 * `Observable`: this is an asynchronous datatype similar to a `Promise`, with
 * powerful additional features. Observables for regular requests emit one
 * response and then finish. Observables for recursive requests can emit
 * multiple items before finishing. Observables are inherently retryable and
 * cancelable, so API requests are inherently retryable and cancelable.
 */

import parseLinkHeader from "parse-link-header";
import { EMPTY, Observable } from "rxjs";
import {
  ajax,
  AjaxConfig,
  AjaxError,
  AjaxRequest,
  AjaxResponse,
} from "rxjs/ajax";
import { catchError, expand, map, reduce } from "rxjs/operators";
import { DateTime } from "luxon";

import { components } from "./schema";
import { store } from "~/store";
import { selectAuth } from "~/modules/auth/reducer";
import { ProblemDetails } from "~/problems";
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
      status: number;
    }
  | {
      type: "TIMEOUT";
      error?: string;
      status: number;
    }
  | {
      type: "APPLICATION";
      error?: string;
      data: ProblemDetails;
      status: number;
    }
  | {
      type: "APPLICATION/UNKNOWN";
      error?: string;
      data: unknown;
      status: number;
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
    super(
      `An API ${details.type} error occurred${
        meta.request.url && " (" + meta.request.url + ")"
      }`,
    );
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
  ajaxResponse: AjaxResponse<T>,
): Response<T> {
  if (ajaxResponse.status < 200 || ajaxResponse.status >= 400) {
    throw new Error(
      `expected a successful API response (status 200-399), but got ${ajaxResponse.status}`,
    );
  }

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

  // Try parsing the x-next header if the Link header failed. (Note: the API is
  // moving to providing all next pages in the Link header, so this can
  // safely be removed at some point in the future).
  if (uriNext === null) {
    const link = ajaxResponse.xhr.getResponseHeader("x-next");
    uriNext = link;
  }

  const responseMeta: ResponseMeta<T> = {
    status,
    mediaType,
    hasNext: uriNext !== null,
    uriNext,
    // is it correct that we always GET?
    // FIXME: this doesn't pass the same arguments as for the original call.
    next: uriNext !== null ? api.getPath<T>(uriNext) : null,
  };

  const meta: Meta<T> = { request: requestMeta, response: responseMeta };

  return { data, meta };
}

function processError(error: AjaxError): ErrorResponse {
  const { status, response: data } = error;

  const requestMeta = processRequestMeta(error.request);
  const meta: Meta<never> = {
    request: requestMeta,
  };

  if (status === 0) {
    return new ErrorResponse(
      {
        type: "AJAX",
        status,
      },
      meta,
    );
  } else if (status >= 400 && status < 600 && typeof data === "object") {
    if (
      typeof data === "object" &&
      error.xhr.getResponseHeader("content-type") === "application/problem+json"
    ) {
      // An RFC7807 HTTP Problem Details response.
      return new ErrorResponse(
        {
          type: "APPLICATION",
          status,
          data: data as ProblemDetails,
        },
        meta,
      );
    } else {
      // An unknown error response.
      return new ErrorResponse(
        {
          type: "APPLICATION/UNKNOWN",
          status,
          data,
        },
        meta,
      );
    }
  } else {
    return new ErrorResponse(
      {
        type: "OTHER",
        status,
      },
      meta,
    );
  }
}

export class BaseApi {
  constructor(protected configuration = new Configuration()) {}

  private createRequestArguments = (options: RequestOptions): AjaxConfig => {
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

      // FIXME: will be deprecated, https://github.com/ReactiveX/rxjs/pull/6710
      // but currently there doesn't seem to be a great way to prevent setting the
      // `x-requested-with` header.
      crossDomain: true,
    };
  };

  /**
   * @throws {ErrorResponse}
   */
  request = <T = unknown>({
    recursePages = false,
    ...options
  }: RequestOptions): Observable<Response<T>> => {
    const request$ = ajax<T>(this.createRequestArguments(options));
    return request$.pipe(
      map((res) => {
        return processResponse(this, res);
      }),
      expand((response) => {
        const uriNext = response.meta.response?.uriNext;
        if (!uriNext || !recursePages) {
          return EMPTY;
        }

        return ajax<T>(
          this.createRequestArguments({
            ...options,
            // explicitly remove the query part (it's set in uriNext by the server)
            query: undefined,
            path: uriNext,
          }),
        ).pipe(
          map((res) => {
            return processResponse(this, res);
          }),
        );
      }),
      catchError((ajaxError) => {
        throw processError(ajaxError as AjaxError);
      }),
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
  /**********************/
  /*** Kit management ***/
  /**********************/

  /**
   * Create a new configuration.
   * @throws {ErrorResponse}
   */
  createConfiguration = ({
    kitSerial,
    newKitConfiguration,
  }: {
    kitSerial: string;
    newKitConfiguration: schemas["NewKitConfiguration"];
  }): Observable<Response<schemas["KitConfiguration"]>> => {
    return this.request({
      path: `/kits/${encodeURI(kitSerial)}/configurations`,
      method: "POST",
      body: newKitConfiguration,
    });
  };

  /**
   * Clone a configuration. The configuration to clone is specified by `id` in
   * the source parameter.
   * @throws {ErrorResponse}
   */
  cloneConfiguration = ({
    kitSerial,
    /** The old configuration id */
    source,
  }: {
    kitSerial: string;
    source: number;
  }): Observable<Response<schemas["KitConfiguration"]>> => {
    return this.request({
      path: `/kits/${encodeURI(kitSerial)}/configurations`,
      method: "POST",
      query: { source },
    });
  };

  /**
   * Create a kit.
   * @throws {ErrorResponse}
   */
  createKit = ({
    newKit,
  }: {
    newKit: schemas["NewKit"];
  }): Observable<Response<{ kitSerial: string; password: string }>> => {
    return this.request({
      path: "/kits",
      method: "POST",
      body: newKit,
    });
  };

  /**
   * Add a peripheral to the configuration.
   * @throws {ErrorResponse}
   */
  createPeripheral = ({
    configurationId,
    newPeripheral,
  }: {
    configurationId: number;
    newPeripheral: schemas["NewPeripheral"];
  }): Observable<Response<schemas["Peripheral"]>> => {
    return this.request({
      path: `/kit-configurations/${encodeURI(
        String(configurationId),
      )}/peripherals`,
      method: "POST",
      body: newPeripheral,
    });
  };

  /**
   * Delete a peripheral.
   * @throws {ErrorResponse}
   */
  deletePeripheral = ({
    peripheralId,
  }: {
    peripheralId: number;
  }): Observable<Response<void>> => {
    return this.request({
      path: `/peripherals/${encodeURI(String(peripheralId))}`,
      method: "DELETE",
    });
  };

  /**
   * The configurations of the specified kit.
   * @throws {ErrorResponse}
   */
  listConfigurations = ({
    kitSerial,
  }: {
    kitSerial: string;
  }): Observable<
    Response<Array<schemas["KitConfigurationWithPeripherals"]>>
  > => {
    return this.request({
      path: `/kits/${encodeURI(kitSerial)}/configurations`,
      method: "GET",
    });
  };

  /**
   * List all actions you are permitted to perform on the specified kit.
   * @throws {ErrorResponse}
   */
  listPermissions = (query: {
    kitSerial: string;
  }): Observable<Response<Array<schemas["Permission"]>>> => {
    return this.request({
      path: "/permissions",
      method: "GET",
      query,
    });
  };

  /**
   * Update the configuration.
   * @throws {ErrorResponse}
   */
  patchConfiguration = ({
    configurationId,
    patchKitConfiguration,
  }: {
    configurationId: number;
    patchKitConfiguration: schemas["PatchKitConfiguration"];
  }): Observable<Response<schemas["KitConfiguration"]>> => {
    return this.request<schemas["KitConfiguration"]>({
      path: `/kit-configurations/${encodeURI(String(configurationId))}`,
      method: "PATCH",
      body: patchKitConfiguration,
    });
  };

  /**
   * Update the kit details.
   * @throws {ErrorResponse}
   */
  patchKit = ({
    kitSerial,
    patchKit,
  }: {
    kitSerial: string;
    patchKit: schemas["PatchKit"];
  }): Observable<Response<schemas["Kit"]>> => {
    return this.request({
      path: `/kits/${encodeURI(kitSerial)}`,
      method: "PATCH",
      body: patchKit,
    });
  };

  /**
   * Update a peripheral.
   * @throws {ErrorResponse}
   */
  patchPeripheral = ({
    peripheralId,
    patchPeripheral,
  }: {
    peripheralId: number;
    patchPeripheral: schemas["PatchPeripheral"];
  }): Observable<Response<void>> => {
    return this.request({
      path: `/peripherals/${encodeURI(String(peripheralId))}`,
      method: "PATCH",
      body: patchPeripheral,
    });
  };

  /**
   * Reset the kit's password.
   * @throws {ErrorResponse}
   */
  resetPassword = ({
    kitSerial,
  }: {
    kitSerial: string;
  }): Observable<Response<string>> => {
    return this.request({
      path: `/kits/${encodeURI(kitSerial)}/password`,
      method: "POST",
    });
  };

  /**
   * Info for a specific kit.
   * @throws {ErrorResponse}
   */
  showKitBySerial = ({
    kitSerial,
  }: {
    kitSerial: string;
  }): Observable<Response<schemas["Kit"]>> => {
    return this.request({
      path: `/kits/${encodeURI(kitSerial)}`,
      method: "GET",
    });
  };

  /**
   * @throws {ErrorResponse}
   */
  listKits = (
    headers: HttpHeaders,
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
      }),
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
      kitSerial,
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

  /***************/
  /*** Kit RPC ***/
  /***************/

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

  /**
   * Query the kit for its uptime.
   * @throws {ErrorResponse}
   */
  uptime = ({
    kitSerial,
  }: {
    kitSerial: string;
  }): Observable<Response<number>> => {
    return this.request({
      path: `/kit-rpc/${encodeURI(kitSerial)}/uptime`,
      method: "GET",
    });
  };

  /**
   * Query the kit for the version it is running.
   * @throws {ErrorResponse}
   */
  version = ({
    kitSerial,
  }: {
    kitSerial: string;
  }): Observable<Response<string>> => {
    return this.request({
      path: `/kit-rpc/${encodeURI(kitSerial)}/version`,
      method: "GET",
    });
  };

  /*******************/
  /*** Definitions ***/
  /*******************/

  listPeripheralDefinitions = (
    query: {
      withExpectedQuantityTypes?: boolean;
      after?: number;
    },
    { recursePages }: { recursePages?: boolean } = {},
  ): Observable<Response<Array<schemas["PeripheralDefinition"]>>> => {
    return this.request({
      path: `/peripheral-definitions`,
      method: "GET",
      query,
      recursePages,
    });
  };

  listQuantityTypes = (
    query: {
      after?: number;
    },
    { recursePages }: { recursePages?: boolean } = {},
  ): Observable<Response<Array<schemas["QuantityType"]>>> => {
    return this.request({
      path: `/quantity-types`,
      method: "GET",
      query,
      recursePages,
    });
  };

  /**********************/
  /*** Authentication ***/
  /**********************/

  /**
   * Authenticate yourself by username and password.
   * @throws {ErrorResponse}
   */
  authenticateByCredentials = ({
    authUser,
  }: {
    authUser: schemas["AuthUser"];
  }): Observable<Response<schemas["AuthenticationTokens"]>> => {
    return this.request({
      path: "/me/auth",
      method: "POST",
      body: authUser,
    });
  };

  /**
   * Obtain an access token from a refresh token.
   * @throws {ErrorResponse}
   */
  obtainAccessTokenFromRefreshToken = ({
    authRefreshToken,
  }: {
    authRefreshToken: schemas["AuthRefreshToken"];
  }): Observable<Response<string>> => {
    return this.request({
      path: "/me/refresh",
      method: "POST",
      body: authRefreshToken,
    });
  };

  /**
   * Information of the authenticated user.
   * @throws {ErrorResponse}
   */
  showMe = (): Observable<Response<schemas["FullUser"]>> => {
    return this.request({
      path: "/me",
      method: "GET",
    });
  };

  /************************/
  /*** User information ***/
  /************************/

  /**
   * Create a user.
   * @throws {ErrorResponse}
   */
  createUser = ({
    newUser,
  }: {
    newUser: schemas["NewUser"];
  }): Observable<Response<void>> => {
    return this.request({
      path: "/users",
      method: "POST",
      body: newUser,
    });
  };

  /**
   * Get the user's details.
   * @throws {ErrorResponse}
   */
  showUserByUsername = ({
    username,
  }: {
    username: string;
  }): Observable<Response<schemas["User"]>> => {
    return this.request({
      path: `/users/${encodeURI(username)}`,
      method: "GET",
    });
  };

  /**
   * Get a user's kit memberships.
   */
  showUserKitMemberships = ({
    username,
  }: {
    username: string;
  }): Observable<Response<Array<schemas["KitMembership"]>>> => {
    return this.request({
      path: `/users/${encodeURI(username)}/kit-memberships`,
      method: "GET",
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

/** A global API instantiation without automatic authentication. */
export const apiUnauthenticated = new Api();

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
  responseType?: XMLHttpRequestResponseType;

  /**
   * Whether we should automatically follow rel=next/x-next link headers. The
   * client will walk all pages one-by-one when the result observable is
   * subscribed. When the last page has been emitted, the observable closes
   * successfully.
   */
  recursePages?: boolean;
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
