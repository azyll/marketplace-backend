export class BadRequestException extends Error {
  statusCode;

  constructor(msg, statusCode = 422) {
    super(msg);
    this.statusCode = statusCode;
  }
}

