class ValidationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "Validation Error";
    this.statusCode = 400;
  }
}

class AuthenticationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "Unauthorized Error";
    this.statusCode = 401;
  }
}

class AuthorizationError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "Forbidden Error";
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "Not Found Error";
    this.statusCode = 404;
  }
}

class InternalServerError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "Internal Server Error";
    this.statusCode = 500;
  }
}

export {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  InternalServerError,
};
