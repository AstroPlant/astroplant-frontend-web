/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  "/version": {
    /** Grab the version of the API. */
    get: {
      responses: {
        /** @description The version of the API. */
        200: {
          content: {
            "application/json": string;
          };
        };
        429: components["responses"]["ErrorRateLimit"];
        500: components["responses"]["ErrorInternalServer"];
      };
    };
  };
  "/time": {
    /** Get the current server time. */
    get: {
      responses: {
        /** @description An RFC3339 and ISO 8601 date and time string. */
        200: {
          content: {
            "application/json": string;
          };
        };
        429: components["responses"]["ErrorRateLimit"];
        500: components["responses"]["ErrorInternalServer"];
      };
    };
  };
  "/kits": {
    /** List all kits set to be shown on the public map. */
    get: operations["listKits"];
    /** Create a kit. */
    post: operations["createKit"];
  };
  "/kits/{kitSerial}": {
    /** Info for a specific kit. */
    get: operations["showKitBySerial"];
    /** Delete a kit. */
    delete: operations["deleteKit"];
    /** Update the kit details. */
    patch: operations["patchKit"];
  };
  "/kits/{kitSerial}/password": {
    /** Reset the kit's password. */
    post: operations["resetPassword"];
  };
  "/kits/{kitSerial}/aggregate-measurements": {
    /** Aggregate measurements made by a kit. */
    get: operations["listAggregateMeasurements"];
  };
  "/kits/{kitSerial}/archive": {
    /** Download a data archive of kit measurements. */
    get: operations["getArchiveContent"];
    /** Request permission to download a data archive of kit measurements. */
    post: operations["authorizeArchiveDownload"];
  };
  "/kits/{kitSerial}/media": {
    /** Media produced by a kit. */
    get: operations["listMedia"];
  };
  "/kits/{kitSerial}/configurations": {
    /** The configurations of the specified kit. */
    get: operations["listConfigurations"];
    /** Create a new configuration. Either the `source` query parameter or the request body must be set (but not both). */
    post: operations["createConfiguration"];
  };
  "/kit-rpc/{kitSerial}/version": {
    /** Query the kit for the version it is running. */
    get: operations["version"];
  };
  "/kit-rpc/{kitSerial}/uptime": {
    /** Query the kit for its uptime. */
    get: operations["uptime"];
  };
  "/kit-rpc/{kitSerial}/peripheral-command": {
    /** Send a command to a peripheral device on the kit. */
    post: operations["peripheralCommand"];
  };
  "/users": {
    /** Create a user. */
    post: operations["createUser"];
  };
  "/users/{username}": {
    /** Get the user's details. */
    get: operations["showUserByUsername"];
  };
  "/users/{username}/kit-memberships": {
    /** Get a user's kit memberships. */
    get: operations["showUserKitMemberships"];
  };
  "/me": {
    /** Your user information. */
    get: operations["showMe"];
  };
  "/me/auth": {
    /** Authenticate yourself by username and password. */
    post: operations["authenticateByCredentials"];
  };
  "/me/refresh": {
    /** Obtain an access token from a refresh token. */
    post: operations["obtainAccessTokenFromRefreshToken"];
  };
  "/peripheral-definitions": {
    /** List all peripheral device definitions. */
    get: operations["listPeripheralDefinitions"];
  };
  "/quantity-types": {
    /** List all quantity types. */
    get: operations["listQuantityTypes"];
  };
  "/permissions": {
    /** List all actions you are permitted to perform on the specified kit. */
    get: operations["listPermissions"];
  };
  "/kit-configurations/{configurationId}": {
    /** Update the configuration. */
    patch: operations["patchConfiguration"];
  };
  "/kit-configurations/{configurationId}/peripherals": {
    /** Add a peripheral to the configuration. */
    post: operations["createPeripheral"];
  };
  "/peripherals/{peripheralId}": {
    /** Delete a peripheral. */
    delete: operations["deletePeripheral"];
    /** Update a peripheral. */
    patch: operations["patchPeripheral"];
  };
  "/media/{mediaId}": {
    /** Delete media. */
    delete: operations["deleteMedia"];
  };
  "/media/{mediaId}/content": {
    /** Download media content. */
    get: operations["getMediaContent"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    /**
     * @description A basic problem report, conforming to RFC7807. Most problems will provide additional fields with information.
     * @example {
     *   "type": "about:blank",
     *   "title": "Bad Request",
     *   "status": 400
     * }
     */
    ProblemDetails: {
      type?: string;
      title?: string;
      status?: number;
      detail?: string;
    };
    ProblemInternalServer: components["schemas"]["ProblemDetails"];
    ProblemRateLimit: components["schemas"]["ProblemDetails"] & {
      waitTimeMillis: number;
    };
    /**
     * @example {
     *   "type": "/probs/invalid-parameters",
     *   "title": "Your request parameters did not validate.",
     *   "status": 400,
     *   "invalidParameters": {
     *     "username": [
     *       "mustBeUnique"
     *     ],
     *     "emailAddress": [
     *       "mustBeEmailAddress",
     *       {
     *         "mustHaveLengthBetween": {
     *           "min": 0,
     *           "max": 255
     *         }
     *       }
     *     ]
     *   }
     * }
     */
    ProblemInvalidParameters: components["schemas"]["ProblemDetails"] & {
      invalidParameters?: {
        [key: string]: components["schemas"]["InvalidParameter"] | undefined;
      };
    };
    InvalidParameter: (
      | ("mustBeEmailAddress" | "mustBeUrl" | "alreadyExists" | "other")
      | {
          mustBeInRange: {
            /** Format: float */
            min: number;
            /** Format: float */
            max: number;
          };
        }
      | {
          mustHaveLengthBetween: {
            min?: number;
            max?: number;
          };
        }
      | {
          mustHaveLengthExactly: {
            length: number;
          };
        }
      | {
          invalidToken: {
            /** @enum {string} */
            category: "missing" | "malformed" | "expired";
          };
        }
    )[];
    ProblemKitRpc: components["schemas"]["ProblemDetails"];
    Kit: {
      /** Format: int32 */
      id: number;
      serial: string;
      name: string;
      description?: string;
      /** Format: float */
      latitude?: number;
      /** Format: float */
      longitude?: number;
      privacyPublicDashboard?: boolean;
      privacyShowOnMap?: boolean;
    };
    PatchKit: {
      name?: string;
      description?: string;
      /** Format: float */
      latitude?: number;
      /** Format: float */
      longitude?: number;
      privacyPublicDashboard?: boolean;
      privacyShowOnMap?: boolean;
    };
    /**
     * @example {
     *   "latitude": 52.1326,
     *   "longitude": 5.2913,
     *   "privacyShowOnMap": true,
     *   "privacyPublicDashboard": false
     * }
     */
    NewKit: {
      name?: string;
      description?: string;
      /** Format: float */
      latitude?: number;
      /** Format: float */
      longitude?: number;
      privacyPublicDashboard: boolean;
      privacyShowOnMap: boolean;
    };
    Kits: components["schemas"]["Kit"][];
    KitMembership: {
      /** Format: int32 */
      id: number;
      user: string;
      kit: components["schemas"]["Kit"];
      accessConfigure: boolean;
      accessSuper: boolean;
      /** Format: date-time */
      datetimeLinked: string;
    };
    /**
     * @example {
     *   "username": "douglas",
     *   "password": "hunter2",
     *   "emailAddress": "d.adams@example.com"
     * }
     */
    NewUser: {
      username: string;
      password: string;
      /** Format: email */
      emailAddress: string;
    };
    /**
     * @example {
     *   "username": "douglas",
     *   "password": "hunter2"
     * }
     */
    AuthUser: {
      username: string;
      password: string;
    };
    /**
     * @example {
     *   "id": 42,
     *   "username": "douglas",
     *   "displayName": "Douglas Adams",
     *   "emailAddress": "d.adams@example.com",
     *   "useEmailAddressForGravatar": false,
     *   "gravatarAlternative": "3NbpHjTp4fYyxnPw4$6xcTp!J%hyhdJq"
     * }
     */
    FullUser: {
      /** Format: int32 */
      id: number;
      username: string;
      displayName: string;
      /** Format: email */
      emailAddress: string;
      useEmailAddressForGravatar: boolean;
      gravatarAlternative: string;
    };
    /**
     * @example {
     *   "username": "douglas",
     *   "displayName": "Douglas Adams",
     *   "gravatar": "3NbpHjTp4fYyxnPw4$6xcTp!J%hyhdJq"
     * }
     */
    User: {
      username: string;
      displayName: string;
      gravatar: string;
    };
    AuthRefreshToken: {
      refreshToken: string;
    };
    AuthenticationTokens: {
      refreshToken: string;
      accessToken: string;
    };
    PeripheralDefinition: {
      /** Format: int32 */
      id: number;
      name: string;
      description?: string;
      brand?: string;
      model?: string;
      symbolLocation: string;
      symbol: string;
      /** @description A JSON schema specifying valid configuration documents. */
      configurationSchema: unknown;
      /** @description A JSON schema specifying valid command documents. */
      commandSchema: Record<string, unknown> | null;
      expectedQuantityTypes?: number[];
    };
    PeripheralDefinitions: components["schemas"]["PeripheralDefinition"][];
    ExpectedQuantityType: {
      /** Format: int32 */
      id: number;
      /** Format: int32 */
      peripheralDefinition: number;
      /** Format: int32 */
      quantityType: number;
    };
    Peripheral: {
      /** Format: int32 */
      id: number;
      /** Format: int32 */
      kitId: number;
      /** Format: int32 */
      kitConfigurationId: number;
      /** Format: int32 */
      peripheralDefinitionId: number;
      name: string;
      /** @description A configuration document. */
      configuration: unknown;
    };
    NewPeripheral: {
      /** Format: int32 */
      peripheralDefinitionId: number;
      name: string;
      /** @description A configuration document. Should conform to the JSON schema specified by the corresponding peripheral definition. */
      configuration: unknown;
    };
    PatchPeripheral: {
      name?: string;
      /** @description A configuration document. Should conform to the JSON schema specified by the corresponding peripheral definition. */
      configuration?: unknown;
    };
    Peripherals: components["schemas"]["Peripheral"][];
    QuantityType: {
      /** Format: int32 */
      id: number;
      physicalQuantity: string;
      physicalUnit: string;
      physicalUnitSymbol?: string;
    };
    QuantityTypes: components["schemas"]["QuantityType"][];
    /** @enum {string} */
    Permission:
      | "view"
      | "subscribeRealTimeMeasurements"
      | "editDetails"
      | "editConfiguration"
      | "editMembers"
      | "setSuperMember";
    Permissions: components["schemas"]["Permission"][];
    KitConfiguration: {
      /** Format: int32 */
      id: number;
      /** Format: int32 */
      kitId: number;
      description?: string;
      controllerSymbolLocation: string;
      controllerSymbol: string;
      /** @description A kit control document. */
      controlRules: unknown;
      active: boolean;
      neverUsed: boolean;
    };
    NewKitConfiguration: {
      description?: string;
    };
    PatchKitConfiguration: {
      description?: string;
      controllerSymbolLocation?: string;
      controllerSymbol?: string;
      /** @description A kit control document. The valid values are currently not specified here. */
      controlRules?: unknown;
      active?: boolean;
    };
    KitConfigurationWithPeripherals: components["schemas"]["KitConfiguration"] & {
      peripherals: components["schemas"]["Peripherals"];
    };
    AggregateMeasurement: {
      /** Format: uuid */
      id: string;
      /** Format: int32 */
      peripheralId: number;
      /** Format: int32 */
      kitId: number;
      /** Format: int32 */
      kitConfigurationId: number;
      /** Format: int32 */
      quantityTypeId: number;
      /** Format: date-time */
      datetimeStart: string;
      /** Format: date-time */
      datetimeEnd: string;
      values: {
        [key: string]: number | undefined;
      };
    };
    Media: {
      /** Format: uuid */
      id: string;
      /** Format: int32 */
      peripheralId: number;
      /** Format: int32 */
      kitId: number;
      /** Format: int32 */
      kitConfigurationId: number;
      /** Format: date-time */
      datetime: string;
      name: string;
      type: string;
      metadata: unknown;
      /** Format: int64 */
      size: number;
    };
  };
  responses: {
    /** @description The JSON you provided was invalid. */
    InvalidJson: {
      content: {
        "application/json": components["schemas"]["ProblemDetails"];
      };
    };
    /** @description You provided invalid parameters. */
    InvalidParameters: {
      content: {
        "application/json": components["schemas"]["ProblemInvalidParameters"];
      };
    };
    /** @description The request was denied because you are not authorized to access the resource. */
    ErrorUnauthorized: never;
    /** @description The request was denied because you exceeded the rate limit. */
    ErrorRateLimit: {
      content: {
        "application/json": components["schemas"]["ProblemRateLimit"];
      };
    };
    /** @description An unexpected error occurred. */
    ErrorInternalServer: {
      content: {
        "application/json": components["schemas"]["ProblemInternalServer"];
      };
    };
    /** @description An error occurred proxying the RPC request: either the connection could not be made, or the kit reported an error. */
    ErrorKitRpc: {
      content: {
        "application/json": components["schemas"]["ProblemKitRpc"];
      };
    };
  };
  parameters: never;
  requestBodies: never;
  headers: {
    /** @description A link to the next page. */
    CursorPaging: string;
    /** @description Contains related links, for example to link to a next page if a next page exists. See [RFC 8288](https://tools.ietf.org/html/rfc8288). The URIs in these links are intended to be followed directly by the client using GET requests with the same authentication headers as the original request. The client does not need to understand the form of the URIs. */
    Link: string;
  };
  pathItems: never;
}

export type external = Record<string, never>;

export interface operations {
  /** List all kits set to be shown on the public map. */
  listKits: {
    parameters: {
      query?: {
        /** @description Fetch all kits after the given identifier. */
        after?: number;
      };
    };
    responses: {
      /** @description A paged array of kits. */
      200: {
        headers: {
          "x-next": components["headers"]["CursorPaging"];
        };
        content: {
          "application/json": components["schemas"]["Kits"];
        };
      };
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Create a kit. */
  createKit: {
    /** @description The kit to create. */
    requestBody: {
      content: {
        "application/json": components["schemas"]["NewKit"];
      };
    };
    responses: {
      /** @description The created kit. */
      201: {
        headers: {
          /** @description A link to the created kit. */
          Location?: string;
        };
        content: {
          "application/json": {
            kitSerial: string;
            password: string;
          };
        };
      };
      400: components["responses"]["InvalidJson"];
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Info for a specific kit. */
  showKitBySerial: {
    parameters: {
      path: {
        /** @description The serial of the kit to retrieve. */
        kitSerial: string;
      };
    };
    responses: {
      /** @description The retrieved kit. */
      200: {
        content: {
          "application/json": components["schemas"]["Kit"];
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Delete a kit. */
  deleteKit: {
    parameters: {
      path: {
        /** @description The serial of the kit to patch. */
        kitSerial: string;
      };
    };
    responses: {
      /** @description The kit was successfully deleted. */
      200: never;
      400: components["responses"]["InvalidJson"];
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Update the kit details. */
  patchKit: {
    parameters: {
      path: {
        /** @description The serial of the kit to patch. */
        kitSerial: string;
      };
    };
    /** @description The kit patch. */
    requestBody: {
      content: {
        "application/json": components["schemas"]["PatchKit"];
      };
    };
    responses: {
      /** @description The patched kit. */
      200: {
        content: {
          "application/json": components["schemas"]["Kit"];
        };
      };
      400: components["responses"]["InvalidJson"];
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Reset the kit's password. */
  resetPassword: {
    parameters: {
      path: {
        /** @description The serial of the kit to reset the password for. */
        kitSerial: string;
      };
    };
    responses: {
      /** @description The kit's new password. */
      200: {
        content: {
          "application/json": string;
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Aggregate measurements made by a kit. */
  listAggregateMeasurements: {
    parameters: {
      query?: {
        /** @description An ID of a kit configuration to filter on. If not given, does not filter on kit configurations. */
        configuration?: number;
        /** @description An ID of a peripheral to filter on. If not given, does not filter on peripherals. */
        peripheral?: number;
        /** @description An ID of a quantity type to filter on. If not given, does not filter on quantity types. */
        quantityType?: number;
        /** @description A cursor for paging. Although this cursor can be constructed by the client (it is the url-encoding of the JSON-serialization of `[datetimeStart, id]` of the last measurement of the current page), this is discouraged. Instead, the Link header in the response body should be used to retrieve the server-generated URI to the next page. */
        cursor?: string;
      };
      path: {
        /** @description The serial of the kit to retrieve aggregate measurements for. */
        kitSerial: string;
      };
    };
    responses: {
      /** @description The retrieved aggregate measurements. */
      200: {
        headers: {
          Link: components["headers"]["Link"];
        };
        content: {
          "application/json": components["schemas"]["AggregateMeasurement"][];
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Download a data archive of kit measurements. */
  getArchiveContent: {
    parameters: {
      query: {
        /** @description A token given by a POST request to '/kits/{kitSerial}/archive' prior to this request. */
        token: string;
        /** @description An ID of a kit configuration to filter on. If not given, does not filter on kit configurations. */
        configuration?: number;
        /** @description A lower bound on date and time of measurements to include in the archive. If not given, does not filter on date and time. */
        from?: string;
        /** @description An upper bound on date and time of measurements to include in the archive. If not given, does not filter on date and time. */
        to?: string;
      };
      path: {
        /** @description The serial of the kit to download a data archive of measurements for. */
        kitSerial: string;
      };
    };
    responses: {
      /** @description The data archive content. */
      200: {
        content: {
          "*": unknown;
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Request permission to download a data archive of kit measurements. */
  authorizeArchiveDownload: {
    parameters: {
      path: {
        /** @description The serial of the kit to download a data archive of measurements for. */
        kitSerial: string;
      };
    };
    responses: {
      /** @description A short-lived token. */
      200: {
        content: {
          "*": unknown;
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Media produced by a kit. */
  listMedia: {
    parameters: {
      query?: {
        /** @description An ID of a kit configuration to filter on. If not given, does not filter on kit configurations. */
        configuration?: number;
        /** @description An ID of a peripheral to filter on. If not given, does not filter on peripherals. */
        peripheral?: number;
        /** @description A cursor for paging. Although this cursor can be constructed by the client (it is the url-encoding of the JSON-serialization of `[datetime, id]` of the last media of the current page), this is discouraged. Instead, the Link header in the response body should be used to retrieve the server-generated URI to the next page. */
        cursor?: string;
      };
      path: {
        /** @description The serial of the kit to retrieve aggregate measurements for. */
        kitSerial: string;
      };
    };
    responses: {
      /** @description The retrieved media. */
      200: {
        headers: {
          Link: components["headers"]["Link"];
        };
        content: {
          "application/json": components["schemas"]["Media"][];
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** The configurations of the specified kit. */
  listConfigurations: {
    parameters: {
      path: {
        /** @description The serial of the kit to retrieve the configurations of. */
        kitSerial: string;
      };
    };
    responses: {
      /** @description The retrieved configurations. */
      200: {
        content: {
          "application/json": components["schemas"]["KitConfigurationWithPeripherals"][];
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Create a new configuration. Either the `source` query parameter or the request body must be set (but not both). */
  createConfiguration: {
    parameters: {
      query?: {
        /** @description The id of the source configuration to clone. If this is set, the request body must not be set. The id is allowed to be of a configuration of a kit other than specified in `kitSerial`, but the agent making the request must have View permission on the kit to clone from. */
        source?: string;
      };
      path: {
        /** @description The serial of the kit to create a configuration for. */
        kitSerial: string;
      };
    };
    /** @description The configuration to create. If this is set, the `source` query parameter must not be set. */
    requestBody?: {
      content: {
        "application/json": components["schemas"]["NewKitConfiguration"];
      };
    };
    responses: {
      /** @description The created kit configuration. */
      201: {
        content: {
          "application/json": components["schemas"]["KitConfiguration"];
        };
      };
      400: components["responses"]["InvalidJson"];
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Query the kit for the version it is running. */
  version: {
    parameters: {
      path: {
        /** @description The serial of the kit to query. */
        kitSerial: string;
      };
    };
    responses: {
      /** @description The version as reported by the kit. */
      200: {
        content: {
          "application/json": string;
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
      502: components["responses"]["ErrorKitRpc"];
    };
  };
  /** Query the kit for its uptime. */
  uptime: {
    parameters: {
      path: {
        /** @description The serial of the kit to query. */
        kitSerial: string;
      };
    };
    responses: {
      /** @description The uptime in seconds as reported by the kit. */
      200: {
        content: {
          "application/json": number;
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
      502: components["responses"]["ErrorKitRpc"];
    };
  };
  /** Send a command to a peripheral device on the kit. */
  peripheralCommand: {
    parameters: {
      path: {
        /** @description The serial of the kit to send a command to. */
        kitSerial: string;
      };
    };
    responses: {
      /** @description The response of the peripheral device. This can be arbitrary content, such as images. The response's media type is given by the content-type header. */
      200: {
        content: {
          "*": unknown;
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
      502: components["responses"]["ErrorKitRpc"];
    };
  };
  /** Create a user. */
  createUser: {
    /** @description The user to create. */
    requestBody: {
      content: {
        "application/json": components["schemas"]["NewUser"];
      };
    };
    responses: {
      /** @description The user was created. */
      201: never;
      400: components["responses"]["InvalidParameters"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Get the user's details. */
  showUserByUsername: {
    parameters: {
      path: {
        /** @description The username of the user to get the details of. */
        username: string;
      };
    };
    responses: {
      /** @description User details. */
      200: {
        content: {
          "application/json": components["schemas"]["User"];
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Get a user's kit memberships. */
  showUserKitMemberships: {
    parameters: {
      path: {
        /** @description The username of the user to get the memberships of. */
        username: string;
      };
    };
    responses: {
      /** @description Kit memberships. */
      200: {
        content: {
          "application/json": components["schemas"]["KitMembership"][];
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Your user information. */
  showMe: {
    responses: {
      /** @description Your user information. */
      200: {
        content: {
          "application/json": components["schemas"]["FullUser"];
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Authenticate yourself by username and password. */
  authenticateByCredentials: {
    /** @description The login credentials. */
    requestBody: {
      content: {
        "application/json": components["schemas"]["AuthUser"];
      };
    };
    responses: {
      /** @description The authentication JSON Web Token pair; i.e. a refresh token valid for a year and an access token valid for a much smaller amount of time (generally around 15 minutes). The refresh token should be stored and used to obtain an access token at regular intervals from the /me/refresh endpoint. */
      200: {
        content: {
          "application/json": components["schemas"]["AuthenticationTokens"];
        };
      };
      400: components["responses"]["InvalidParameters"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Obtain an access token from a refresh token. */
  obtainAccessTokenFromRefreshToken: {
    /** @description The refresh token. */
    requestBody: {
      content: {
        "application/json": components["schemas"]["AuthRefreshToken"];
      };
    };
    responses: {
      /** @description The JSON Web Token necessary for using authenticated endpoints. */
      200: {
        content: {
          "application/json": string;
        };
      };
      400: components["responses"]["InvalidParameters"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** List all peripheral device definitions. */
  listPeripheralDefinitions: {
    parameters: {
      query?: {
        /** @description Fetch all peripheral definitions after the given identifier. */
        after?: number;
        /** @description If set to true, include in the output the quantity types the peripheral is expected to produce. */
        withExpectedQuantityTypes?: boolean;
      };
    };
    responses: {
      /** @description A paged array of peripheral definitions. */
      200: {
        headers: {
          "x-next": components["headers"]["CursorPaging"];
        };
        content: {
          "application/json": components["schemas"]["PeripheralDefinitions"];
        };
      };
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** List all quantity types. */
  listQuantityTypes: {
    parameters: {
      query?: {
        /** @description Fetch all quantity types after the given identifier. */
        after?: number;
      };
    };
    responses: {
      /** @description A paged array of quantity types. */
      200: {
        headers: {
          "x-next": components["headers"]["CursorPaging"];
        };
        content: {
          "application/json": components["schemas"]["QuantityTypes"];
        };
      };
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** List all actions you are permitted to perform on the specified kit. */
  listPermissions: {
    parameters: {
      query?: {
        /** @description The serial of the kit to fetch the permissions for. */
        kitSerial?: string;
      };
    };
    responses: {
      /** @description An array of actions you are permitted to perform on the specified kit. */
      200: {
        content: {
          "application/json": components["schemas"]["Permissions"];
        };
      };
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Update the configuration. */
  patchConfiguration: {
    parameters: {
      path: {
        /** @description The id of the configuration to patch. */
        configurationId: number;
      };
    };
    /** @description The configuration patch. */
    requestBody: {
      content: {
        "application/json": components["schemas"]["PatchKitConfiguration"];
      };
    };
    responses: {
      /** @description The patched kit configuration. */
      200: {
        content: {
          "application/json": components["schemas"]["KitConfiguration"];
        };
      };
      400: components["responses"]["InvalidJson"];
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Add a peripheral to the configuration. */
  createPeripheral: {
    parameters: {
      path: {
        /** @description The id of the configuration to add a peripheral to. */
        configurationId: number;
      };
    };
    /** @description The peripheral to add. */
    requestBody: {
      content: {
        "application/json": components["schemas"]["NewPeripheral"];
      };
    };
    responses: {
      /** @description The added peripheral. */
      201: {
        content: {
          "application/json": components["schemas"]["Peripheral"];
        };
      };
      400: components["responses"]["InvalidJson"];
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Delete a peripheral. */
  deletePeripheral: {
    parameters: {
      path: {
        /** @description The id of the peripheral to delete. */
        peripheralId: number;
      };
    };
    responses: {
      /** @description The peripheral has been deleted. */
      200: never;
      400: components["responses"]["InvalidJson"];
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Update a peripheral. */
  patchPeripheral: {
    parameters: {
      path: {
        /** @description The id of the peripheral to update. */
        peripheralId: number;
      };
    };
    /** @description The peripheral patch. */
    requestBody: {
      content: {
        "application/json": components["schemas"]["PatchPeripheral"];
      };
    };
    responses: {
      /** @description The peripheral has been deleted. */
      200: never;
      400: components["responses"]["InvalidJson"];
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Delete media. */
  deleteMedia: {
    parameters: {
      path: {
        /** @description The id of the media to delete. */
        mediaId: string;
      };
    };
    responses: {
      /** @description The media was successfully deleted. */
      200: {
        content: {
          "*": unknown;
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
  /** Download media content. */
  getMediaContent: {
    parameters: {
      path: {
        /** @description The id of the media to download. */
        mediaId: string;
      };
    };
    responses: {
      /** @description The media content. */
      200: {
        content: {
          "*": unknown;
        };
      };
      401: components["responses"]["ErrorUnauthorized"];
      429: components["responses"]["ErrorRateLimit"];
      500: components["responses"]["ErrorInternalServer"];
    };
  };
}
