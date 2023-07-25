/**
 * Base shape of a response.
 */
export interface IResponse {
  status: string;
  body?: unknown;
  headers?: Record<string, string>;
}

/**
 * The interface of an error response
 */
export interface IErrorResponse extends IResponse {
  status: '400' | '404' | '500' | '401';
  body: {
    message: string;
  };
}

/**
 * The interface of a login response
 */
export interface ILoginResponse extends IResponse {
  status: '200';
  body: {
    token: string;
  };
}
