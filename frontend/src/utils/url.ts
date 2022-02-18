import {
  getParams,
  getParamsExtended,
  addParamsExtended,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
} from "vanilla-js-url/dist/url";
import { replaceAll } from "./text";

const replaceState = function (url: string) {
  if (typeof history.replaceState !== "undefined")
    history.replaceState(null, document.title, url);
  else window.location.assign(url);
};

const parseSearchParams = (search: string = location.search): object => {
  let params = getParams(search);

  for (const paramsKey in params)
    if (paramsKey.includes("[")) delete params[paramsKey];

  params = { ...params, ...getParamsExtended(search) };

  return params;
};

const stringifySearchParams = (params: object = {}): string => {
  return replaceAll(addParamsExtended("", params), "#", "%23");
};

const appendSearchParams = (params: object): object => {
  let params_ = parseSearchParams();

  params_ = { ...params_, ...params };

  const search = stringifySearchParams(params_);

  replaceState(location.origin + location.pathname + search);

  return params_;
};

export { parseSearchParams, stringifySearchParams, appendSearchParams };
