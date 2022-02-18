import { stringifySearchParams } from "./url";
import { RequestMethod } from "@/typings/app";

export enum RequestHeaders {
  Accept = "Accept",
  ContentType = "Content-Type",
  AccessControlAllowCredentials = "Access-Control-Allow-Credentials",
}

export enum RequestHeaderContentType {
  json = "application/json",
  formData = "multipart/form-data",
}

export type RequestSettings = {
  url: string;
  method: RequestMethod;
  params?: object;
  body?: object;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
};

export enum ResponseType {
  Informational = "informational",
  Success = "success",
  Redirection = "redirection",
  Error = "error", // Этот тип несет в себе ошибку cors и другие
  Aborted = "aborted",
}

export type BaseResponse<R extends object | null> = {
  nativeError: Error | null;
  nativeResponse: Response | null;
  type: ResponseType;
  json: R | null;
};

export type GeneratedRequest<R extends object | null> = {
  abort(): void;
  start(): Promise<BaseResponse<R>>;
};

export function generateRequest<R extends object | null>(
  settings: RequestSettings
): GeneratedRequest<R> {
  let url = settings.url;
  const method = settings.method;
  const params = settings.params ?? null;
  const body = settings.body ?? null;
  const credentials = settings.credentials ?? "same-origin";
  const headers = settings.headers ?? {};

  let loading = false;
  const controller = new AbortController();

  function abort() {
    if (loading && !controller.signal.aborted) controller.abort();
  }

  return {
    abort,
    start(): Promise<BaseResponse<R>> {
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async (resolve, reject) => {
        loading = true;
        const options: RequestInit = {
          method,
          headers,
          credentials,
          signal: controller.signal,
        };

        if (params) url += stringifySearchParams(params);

        if (body) options.body = JSON.stringify(body);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options.headers[RequestHeaders.ContentType] =
          RequestHeaderContentType.json;

        const response: BaseResponse<R> = {
          nativeError: null,
          nativeResponse: null,
          type: ResponseType.Error,
          json: null,
        };
        try {
          response.nativeResponse = await fetch(url, options);
          if (String(response.nativeResponse.status).startsWith("1")) {
            response.type = ResponseType.Informational;
          } else if (String(response.nativeResponse.status).startsWith("2")) {
            response.type = ResponseType.Success;
          } else if (String(response.nativeResponse.status).startsWith("3")) {
            response.type = ResponseType.Redirection;
          }
        } catch (error: any) {
          response.type = ResponseType.Error;
          if (error.url && error.status) {
            response.nativeResponse = error;
          } else {
            response.nativeError = error;
          }
          if (error.name === "AbortError") {
            response.type = ResponseType.Aborted;
          }
        }

        if (response.nativeResponse) {
          try {
            const text = await response.nativeResponse.text();
            if (text) {
              response.json = JSON.parse(text);
            }
          } catch (e) {
            console.error(e);
          }
        }

        if (
          response.type === ResponseType.Error ||
          response.type === ResponseType.Aborted
        ) {
          reject(response);
        } else {
          resolve(response);
        }

        loading = false;
      });
    },
  };
}
