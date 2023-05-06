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
import { ajax, AjaxResponse } from "rxjs/ajax";
import { map } from "rxjs/operators";
import { DateTime } from "luxon";

import Option from "../utils/option";
import { components } from "./schema";
export type schemas = components["schemas"];

export const BASE_PATH =
  import.meta.env.VITE_API_URL || "http://localhost:8080";

export interface ConfigurationParameters {
  basePath?: string; // override base path
  accessToken?: string | (() => string | null); // parameter for oauth2 security
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

export class Response<T> {
  private status: number;
  private uriNext: string | null = null;
  public content: T;
  public mediaType: string | null;

  constructor(private api: BaseApi, public ajaxResponse: AjaxResponse) {
    this.status = ajaxResponse.status;
    this.content = ajaxResponse.response;

    this.mediaType = ajaxResponse.xhr.getResponseHeader("content-type");

    const link = ajaxResponse.xhr.getResponseHeader("link");
    if (link !== null) {
      const parsed = parseLinkHeader(link);
      this.uriNext = ((parsed || {}).next || {}).url || null;
    }
  }

  get statusCode(): number {
    return this.status;
  }

  hasNext(): boolean {
    return this.uriNext !== null;
  }

  next(): Option<Observable<Response<T>>> {
    if (this.uriNext === null) {
      return Option.none();
    } else {
      return Option.some(this.api.getPath(this.uriNext));
    }
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

  protected request = <T>(options: RequestOptions): Observable<Response<T>> => {
    return ajax(this.createRequestArguments(options)).pipe(
      map((res) => {
        if (res.status >= 200 && res.status < 300) {
          return new Response(this, res);
        }
        throw res;
      })
    );
  };

  getPath = <T>(url: string): Observable<Response<T>> => {
    return this.request({ path: url, method: "GET" });
  };
}

export class KitsApi extends BaseApi {
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

  getMediaContent = ({
    mediaId,
  }: {
    mediaId: string;
  }): Observable<Response<any>> => {
    return this.request<any>({
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
}

export class KitRpcApi extends BaseApi {
  peripheralCommand = ({
    kitSerial,
    peripheral,
    command,
  }: {
    kitSerial: string;
    peripheral: string;
    command: string;
  }): Observable<Response<any>> => {
    return this.request<any>({
      path: `/kit-rpc/${encodeUri(kitSerial)}/peripheral-command`,
      method: "POST",
      body: { peripheral, command },
      responseType: "blob",
    });
  };
}

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

export default 0;
