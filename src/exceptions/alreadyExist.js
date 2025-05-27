export class AlreadyExistException extends Error {
  statusCode;

  constructor(msg, statusCode = 409) {
    super(msg);
    this.statusCode = statusCode;
  }
}
