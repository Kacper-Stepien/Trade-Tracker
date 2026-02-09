import { t } from "i18next";

export const getApiErrorMessage = (error: unknown): string | undefined => {
  if (!error) return undefined;
  const axiosError = error as Error;
  const apiMessage = axiosError.message;
  console.log(apiMessage);

  const errorKey = Array.isArray(apiMessage) ? apiMessage[0] : apiMessage;

  if (errorKey) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const translation = t(`apiErrors.${errorKey}` as any);

    if (translation !== `apiErrors.${errorKey}`) {
      return translation;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return t("apiErrors.UNEXPECTED_ERROR" as any);
};
