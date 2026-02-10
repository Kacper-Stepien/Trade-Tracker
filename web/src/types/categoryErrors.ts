import { ApiError } from "./errors";

export class CategoryAlreadyExistsError extends ApiError {
  constructor(message: string, context?: Record<string, unknown>) {
    super("CATEGORY_ALREADY_EXISTS", message, 409, context);
  }
}
