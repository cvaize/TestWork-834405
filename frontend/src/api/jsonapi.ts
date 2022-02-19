import { stringifySearchParams } from "@/utils/url";
import {
  JSONAPIFetchParams,
  JsonapiManyTransfer,
  JsonapiOneTransfer,
  RequestMethods,
} from "@/typings/app";
import {
  v1DefaultModel,
  v1JsonapiTypes,
  v1TransferEntity,
} from "@/typings/v1-jsonapi";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const inflector = require("jsonapi-serializer-cvaize/lib/inflector.js");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const JSONAPI = require("jsonapi-serializer-cvaize");
const JSONAPIDeserializer = JSONAPI.Deserializer;
const JSONAPISerializer = JSONAPI.Serializer;

type KeyForAttribute =
  | "camelCase"
  | "CamelCase"
  | "dash-case"
  | "lisp-case"
  | "spinal-case"
  | "kebab-case"
  | "underscore_case"
  | "snake_case";

type SerializeOptions = {
  attributes?: string[];
  keyForAttribute?: KeyForAttribute;
};

export type JSONAPIFetcher = {
  load: (
    params: JSONAPIFetchParams,
    transformCallback?: TransformCallback
  ) => Promise<any>;
  destroy: () => void;
  abort: () => void;
};

const keyCamelCase = {};

type TransformCallback = <D extends v1TransferEntity, R extends v1DefaultModel>(
  record: R,
  data: D
) => R;

function deserialize<R extends v1DefaultModel | v1DefaultModel[]>(
  data:
    | JsonapiOneTransfer<v1TransferEntity>
    | JsonapiManyTransfer<v1TransferEntity>,
  transformCallback: TransformCallback | null = null
): Promise<R> {
  const keyForAttribute = "camelCase";

  const Deserializer = new JSONAPIDeserializer({
    keyForAttribute,
    transform(record: v1DefaultModel, data: v1TransferEntity) {
      if (data.relationships) {
        for (const key in data.relationships) {
          const relationship = data.relationships[key];
          if (relationship.meta && "count" in relationship.meta) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            keyCamelCase[key] = keyCamelCase[key] ?? {
              count: inflector.caserize(key, { keyForAttribute }) + "Count",
            };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const name = keyCamelCase[key].count;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            if (record[name]) {
              console.error(
                "Поле " +
                  name +
                  " конкурирует с мета данными количества записей."
              );
            }
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            record[name] = relationship.meta.count;
          }
        }
      }
      if (transformCallback) {
        record = transformCallback(record, data) ?? record;
      }
      return record;
    },
  });

  return new Promise(function (resolve, reject) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    Deserializer.deserialize(data, function (err, items) {
      if (err) {
        reject(err);
      }
      resolve(items);
    });
  });
}

function serialize<R extends v1TransferEntity>(
  type: v1JsonapiTypes,
  data: v1DefaultModel | v1DefaultModel[],
  options: SerializeOptions
): Promise<JsonapiOneTransfer<R> | JsonapiManyTransfer<R>> {
  return new Promise(function (resolve) {
    options.keyForAttribute = options.keyForAttribute || "camelCase";
    const Serializer = new JSONAPISerializer(type, options);
    const body = Serializer.serialize(data);
    resolve(body);
  });
}
// const csrfMeta = document.querySelector('meta[name="csrf-token"]');
const headers = {
  // "X-CSRF-TOKEN": csrfMeta ? csrfMeta.getAttribute("content") : "",
  Accept: "application/json",
  "Access-Control-Allow-Credentials": "true",
  "Content-Type": "application/vnd.api+json",
};

const defaultServer = "v1";
const defaultBaseUrl = "/api";

type GeneratedRequest<R> = { abort(): void; start(): Promise<R> };

// TODO: Заменить потом на версию из src/utils/request.ts
function generateRequest(
  url: string,
  method: RequestMethods,
  params: JSONAPIFetchParams | null = null,
  body: object | null = null
): GeneratedRequest<any> {
  let loading = true;
  const controller = new AbortController();

  function abort() {
    if (loading && !controller.signal.aborted) {
      controller.abort();
    }
  }

  return {
    abort,
    start(): Promise<any> {
      return new Promise(function (resolve, reject) {
        const options: RequestInit = {
          method,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          headers,
          signal: controller.signal,
        };
        if (params) {
          url += stringifySearchParams(params);
        }
        if (body) {
          options.body = JSON.stringify(body);
        }
        fetch(url, options)
          .then((response) => {
            loading = false;
            if (!String(response.status).startsWith("2")) {
              reject(response);
            } else {
              if (String(response.status) === "204") {
                resolve(response);
              } else {
                resolve(response.json());
              }
            }
          })
          .catch((error) => {
            loading = false;
            reject(error);
          });
      });
    },
  };
}

// разделение на many и one нужно для наглядности
const jsonapi = {
  deserializeOne<D extends v1TransferEntity, R extends v1DefaultModel>(
    data: JsonapiOneTransfer<D>
  ): Promise<R> {
    return deserialize<R>(data);
  },
  deserializeMany<D extends v1TransferEntity, R extends v1DefaultModel>(
    data: JsonapiManyTransfer<D>,
    transformCallback: TransformCallback | null = null
  ): Promise<R[]> {
    return deserialize<R[]>(data, transformCallback);
  },
  serializeOne<D extends v1DefaultModel, R extends v1TransferEntity>(
    type: v1JsonapiTypes,
    data: D,
    options: SerializeOptions
  ): Promise<JsonapiOneTransfer<R>> {
    return <Promise<JsonapiOneTransfer<R>>>serialize(type, data, options);
  },
  serializeMany<D extends v1DefaultModel, R extends v1TransferEntity>(
    type: v1JsonapiTypes,
    data: D[],
    options: SerializeOptions
  ): Promise<JsonapiManyTransfer<R>> {
    return <Promise<JsonapiManyTransfer<R>>>serialize(type, data, options);
  },
  fetch<R extends v1TransferEntity>(
    type: v1JsonapiTypes,
    params?: JSONAPIFetchParams
  ): GeneratedRequest<JsonapiManyTransfer<R>> {
    return generateRequest(
      `${defaultBaseUrl}/${defaultServer}/${type}`,
      "GET",
      params
    );
  },
  fetchOne<R extends v1TransferEntity>(
    type: v1JsonapiTypes,
    id: string | number,
    params?: JSONAPIFetchParams
  ): GeneratedRequest<JsonapiOneTransfer<R>> {
    return generateRequest(
      `${defaultBaseUrl}/${defaultServer}/${type}/${id}`,
      "GET",
      params
    );
  },
  updateOne<D extends v1TransferEntity>(
    body: JsonapiOneTransfer<D>,
    params?: JSONAPIFetchParams
  ): GeneratedRequest<JsonapiOneTransfer<D>> {
    const type = body.data.type;
    const id = body.data.id;
    return generateRequest(
      `${defaultBaseUrl}/${defaultServer}/${type}/${id}`,
      "PATCH",
      params,
      body
    );
  },
  storeOne<D extends v1TransferEntity>(
    body: JsonapiOneTransfer<D>,
    params?: JSONAPIFetchParams
  ): GeneratedRequest<JsonapiOneTransfer<D>> {
    const type = body.data.type;
    return generateRequest(
      `${defaultBaseUrl}/${defaultServer}/${type}`,
      "POST",
      params,
      body
    );
  },
  deleteOne<D extends v1TransferEntity>(
    type: v1JsonapiTypes,
    id: string | number
  ): GeneratedRequest<JsonapiOneTransfer<D>> {
    return generateRequest(
      `${defaultBaseUrl}/${defaultServer}/${type}/${id}`,
      "DELETE"
    );
  },
  makeFetcherDeserializer<D extends v1TransferEntity, R extends v1DefaultModel>(
    type: v1JsonapiTypes
  ): JSONAPIFetcher {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let abort = () => {};
    // noinspection UnnecessaryLocalVariableJS
    const result: JSONAPIFetcher = {
      abort() {
        abort();
      },
      destroy() {
        abort();
      },
      async load(
        params?: JSONAPIFetchParams,
        transformCallback: TransformCallback | null = null
      ) {
        abort();

        const request_ = jsonapi.fetch<D>(type, params);

        abort = request_.abort;

        const data: JsonapiManyTransfer<D> = await request_.start();

        return await jsonapi.deserializeMany<D, R>(data, transformCallback);
      },
    };
    return result;
  },
  makeFetcher<D extends v1TransferEntity>(
    type: v1JsonapiTypes
  ): JSONAPIFetcher {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    let abort = () => {};
    // noinspection UnnecessaryLocalVariableJS
    const result: JSONAPIFetcher = {
      abort() {
        abort();
      },
      destroy() {
        abort();
      },
      async load(params?: JSONAPIFetchParams): Promise<JsonapiManyTransfer<D>> {
        abort();

        const request_ = jsonapi.fetch<D>(type, params);

        abort = request_.abort;

        // noinspection UnnecessaryLocalVariableJS
        const data: JsonapiManyTransfer<D> = await request_.start();

        return data;
      },
    };
    return result;
  },
};

export default jsonapi;
