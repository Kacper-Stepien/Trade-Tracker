import { ApiError } from "./ApiError.type";

export interface AxiosError {
  response: {
    data: ApiError;
  };
}
