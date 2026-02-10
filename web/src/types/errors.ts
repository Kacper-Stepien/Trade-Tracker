export class ApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly statusCode?: number,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
