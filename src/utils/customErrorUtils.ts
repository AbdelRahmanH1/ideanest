export class CustomError extends Error {
  public statusCode: number;
  constructor(message: string | string[], statusCode: number) {
    const errorMessage = Array.isArray(message) ? message.join(', ') : message;
    super(errorMessage);
    this.statusCode = statusCode;
  }
}
