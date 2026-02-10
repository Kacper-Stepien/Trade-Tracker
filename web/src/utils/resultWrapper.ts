import { ResultAsync } from "neverthrow";
import { ApiError } from "../types/errors";
import { AxiosError } from "axios";

export const toResult = <T>(
  promise: Promise<{ data: T }>,
): ResultAsync<T, ApiError> => {
  return ResultAsync.fromPromise(promise, (error) => {
    const axiosError = error as AxiosError<{ code: string; message: string }>;

    if (!axiosError.response) {
      if (!navigator.onLine) {
        return new ApiError("NETWORK_ERROR", "No internet connection", 0);
      }

      if (axiosError.code === "ECONNABORTED") {
        return new ApiError("TIMEOUT_ERROR", "Request timed out", 0);
      }

      return new ApiError("SERVER_UNAVAILABLE", "Server is not responding", 0);
    }
    const data = axiosError.response?.data;

    return new ApiError(
      data?.code || "INTERNAL_SERVER_ERROR",
      data?.message || "Unexpected error",
      axiosError.response?.status,
    );
  }).map((res) => res.data);
};
