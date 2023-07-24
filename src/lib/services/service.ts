import axios from 'axios';
import { type ILoginOptions } from '../models/requestOptions';
import {
  type IErrorResponse,
  type ILoginResponse,
  type IUnknowErrorResponse,
} from '../models/response';

const TIMEOUT = 10 * 1000;

interface ServicesLib {
  '/api/v1/login': {
    post: (
      input: ILoginOptions
    ) => Promise<ILoginResponse | IErrorResponse | IUnknowErrorResponse>;
  };
  /*
  'v1/device/{deviceId}': {
    get: () => void;
  };
  */
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
): Promise<T | IErrorResponse | IUnknowErrorResponse> {
  try {
    return await f();
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      if (e.status == 400 || e.status == 404 || e.status == 500) {
        const s = `${e.status!}` as const;
        const resp: IErrorResponse = {
          status: s,
          body: {
            message: e.message,
          },
        };
        return resp;
      } else {
        const resp: IUnknowErrorResponse = {
          status: e.code,
          body: {
            message: e.message,
          },
        };
        return resp;
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

export function BuildClient(url: string): { path: Path } {
  const path: Path = (path, ...params) => {
    const service: ServicesLib = {
      '/api/v1/login': {
        post: async function (
          input: ILoginOptions
        ): Promise<ILoginResponse | IErrorResponse | IUnknowErrorResponse> {
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
              .post<ILoginResponse>(path, data)
              .then((resp) => resp.data);
          };

          const resp = await errorWrapper(innerFunction);
          console.log(`resp: ${JSON.stringify(resp)}`);
          return resp;
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
