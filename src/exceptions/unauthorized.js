export class UnauthorizedException extends Error {
  statusCode;

  constructor(msg) {
    super(msg);
    this.statusCode = 401;
  }
}
