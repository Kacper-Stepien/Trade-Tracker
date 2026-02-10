import { ParseKeys, t } from "i18next";
import { ApiError } from "../types/errors";

export const translateError = (error: ApiError) => {
  const translationKey = `apiErrors.${error.code}` as ParseKeys;
  console.log(translationKey);
  return t(translationKey, { defaultValue: t("common.errors.error") });
};
