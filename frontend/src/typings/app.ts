import {
  v1JsonapiTypes,
  v1ProductTransferEntity,
  v1TransferEntity,
} from "@/typings/v1-jsonapi";

export enum RequestMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  OPTION = "OPTION",
}

export type JsonapiManyTransfer<T extends v1TransferEntity> = {
  jsonapi?: {
    version: "1.0" | string;
  };
  data: T[];
  included?: v1TransferEntity[];
  meta?: {
    page?: {
      total: number;
    };
  };
};

export type JsonapiOneTransfer<T extends v1TransferEntity> = {
  jsonapi?: {
    version: "1.0" | string;
  };
  data: T;
  included?: v1TransferEntity[];
};

export type JSONAPIFetchParams = {
  withCount?: string;
  sort?: string;
  filter?: {
    [key: string]: string;
  };
  page?: {
    number: number;
    size: number;
  };
  include?: string;
  fields?: {
    [key: string]: string;
  };
};

export type JSONAPIPaginateParams = JSONAPIFetchParams & {
  page: {
    number: number;
    size: number;
  };
};

export type JSONAPIActionOptions = {
  type: v1JsonapiTypes;
  params?: JSONAPIFetchParams;
  body?: object;
};

export type v1JSONAPIUpdateOneOptions = JSONAPIActionOptions & {
  type?: null;
  body: v1ProductTransferEntity;
};

export type RequestMethods =
  | "GET"
  | "POST"
  | "PATCH"
  | "UPDATE"
  | "DELETE"
  | "OPTION";
