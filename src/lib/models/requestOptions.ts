/**
 * Base shape of the request parameters
 */
export interface IRequestOptions {
  body?: unknown;
  headers?: Record<string, string>;
  queryParameters?: Record<string, string>;
}

/**
 * Login request needs to provide the `username` and `password`
 */
export interface ILoginOptions extends IRequestOptions {
  body: {
    username: string;
    password: string;
  };
}

/**
 * Get devices needs to provide the `query` or empty string
 */
export interface IGetDevicesOptions extends IRequestOptions {
  body: {
    query?: string;
  };
}
