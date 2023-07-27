import axios from 'axios';
import {
  type IGetDevicesOptions,
  type ILoginOptions,
} from '../models/requestOptions';
import {
  type IErrorResponse,
  type ILoginResponse,
  type IGetDevicesResponse,
} from '../models/response';

const TIMEOUT = 10 * 1000;

interface ServicesLib {
  '/api/v1/login': {
    post: (input: ILoginOptions) => Promise<ILoginResponse | IErrorResponse>;
  };
  '/api/v1/devices': {
    get: (
      input: IGetDevicesOptions
    ) => Promise<IGetDevicesResponse | IErrorResponse>;
  };
}

type TPathParameter<TPath extends string> =
  TPath extends `${infer _Head}/{${infer _Parameter}}${infer Tail}`
    ? [pathParameter: string, ...params: TPathParameter<Tail>]
    : [];

type PathParameter<TPath extends string> =
  TPath extends `${infer _API}/${infer _Version}/${infer _Head}/{${infer _Parameter}}${infer Tail}`
    ? [pathParameter: string, ...params: TPathParameter<Tail>]
    : [];

type Path = <TPath extends keyof ServicesLib>(
  path: TPath,
  ...params: PathParameter<TPath>
) => ServicesLib[TPath];

async function errorWrapper<T>(
  f: () => Promise<T>
): Promise<T | IErrorResponse> {
  try {
    return await f();
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (
        e.response.status == 400 ||
        e.response.status == 404 ||
        e.response.status == 500 ||
        e.response.status == 401
      ) {
        const s = `${e.response.status}` as const;
        const resp: IErrorResponse = {
          status: s,
          body: {
            message: e.message,
          },
        };
        return resp;
      } else {
        console.error(`unknown error: ${JSON.stringify(e)}`);
      }
    } else {
      console.error(
        `encountered a non-axios error when request a api to server. ${JSON.stringify(
          e
        )}`
      );
    }
  }
}

async function login<TPath extends keyof ServicesLib>(
  url: string,
  path: TPath,
  input: ILoginOptions
): Promise<ILoginResponse | IErrorResponse> {
  const innerFunction = async () => {
    const data = JSON.stringify(input.body);
    return await axios
      .create({
        baseURL: url,
        timeout: TIMEOUT,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      })
      .post<{ token: string }>(path, data)
      .then((data) => {
        const resp: ILoginResponse = {
          status: '200',
          body: {
            token: data.data.token,
          },
        };
        return resp;
      });
  };

  return await errorWrapper(innerFunction);
}

async function list_devices<TPath extends keyof ServicesLib>(
  url: string,
  path: TPath,
  input: IGetDevicesOptions
): Promise<IGetDevicesResponse | IErrorResponse> {
  if (!input.body.query) {
    const resp: IGetDevicesResponse = {
      status: '200',
      body: {
        devices: [
          { id: '1', name: '1' },
          { id: '2', name: '2' },
        ],
      },
    };

    return Promise.resolve(resp);
  }

  const resp: IGetDevicesResponse = {
    status: '200',
    body: {
      devices: [
        { id: '1', name: `1. ${input.body.query}` },
        { id: '2', name: `2. ${input.body.query}` },
      ],
    },
  };

  return Promise.resolve(resp);
}

export function BuildClient(url: string): { path: Path } {
  const path: Path = (path, ...params) => {
    const service: ServicesLib = {
      '/api/v1/login': {
        post: async function (input: ILoginOptions) {
          return login(url, path, input);
        },
      },
      '/api/v1/devices': {
        get: async function (input: IGetDevicesOptions) {
          return list_devices(url, path, input);
        },
      },
    };

    return service[path];
  };

  return {
    path: path,
  };
}

export const servicesClient = BuildClient('http://127.0.0.1:3000/');
