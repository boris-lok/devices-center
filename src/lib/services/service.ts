import { type ILoginOptions } from '../models/requestOptions';
import { type IErrorResponse, type ILoginResponse } from '../models/response';

interface ServicesLib {
  'v1/login': {
    post: (input: ILoginOptions) => Promise<ILoginResponse | IErrorResponse>;
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
  TPath extends `${infer _Version}/${infer _Head}/{${infer _Parameter}}${infer Tail}`
    ? [pathParameter: string, ...params: TPathParameter<Tail>]
    : [];

type Path = <TPath extends keyof ServicesLib>(
  path: TPath,
  ...params: PathParameter<TPath>
) => ServicesLib[TPath];

export function BuildClient(url: string): { path: Path } {
  const path: Path = (path, ...params) => {
    const service: ServicesLib = {
      'v1/login': {
        post: function(input: ILoginOptions): Promise<ILoginResponse | IErrorResponse> {
          // todo: call api
          throw new Error('Function not implemented.');
        }
      }
    };

    return service[path];
  };

  return {
    path: path,
  };
}

const c = BuildClient('').path('v1/device/{deviceId}', 'a');
