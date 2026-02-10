export const ApiErrorCode = {
  CATEGORY_ALREADY_EXISTS: "CATEGORY_ALREADY_EXISTS",
  CATEGORY_NOT_FOUND: "CATEGORY_NOT_FOUND",
} as const;

export type ApiErrorCode = (typeof ApiErrorCode)[keyof typeof ApiErrorCode];
