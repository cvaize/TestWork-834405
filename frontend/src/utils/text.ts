export const toTitleCase = (str: string) =>
  str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );

export const trimDoubleSpace = (str: string) =>
  str.replace(/[\s]+/g, " ").trim();

export const getUserFio = (
  lastName: string,
  firstName: string,
  middleName: string,
  defaultName = ""
): string => {
  const fio = trimDoubleSpace(
    `${lastName || ""} ${firstName || ""} ${middleName || ""}`
  );
  return fio ? fio : defaultName;
};

export const getTitleCaseUserFio = (
  lastName: string,
  firstName: string,
  middleName: string,
  defaultName = ""
): string => {
  const fio = getUserFio(lastName, firstName, middleName, defaultName);
  return fio !== defaultName ? toTitleCase(fio) : fio;
};

export const pluralize = (number: number, suffix: string[]) => {
  const keys = [2, 0, 1, 1, 1, 2];
  const mod = number % 100;
  const suffixKey = mod > 7 && mod < 20 ? 2 : keys[Math.min(mod % 10, 5)];
  return suffix[suffixKey];
};

export const replaceAll = (
  str: string,
  search: string,
  replacement: string
) => {
  return str.replace(new RegExp(search, "g"), replacement);
};
