export class NotFoundException extends Error {
  statusCode;

  constructor(msg, statusCode = 400) {
    super(msg);
    this.statusCode = statusCode;
  }
}
