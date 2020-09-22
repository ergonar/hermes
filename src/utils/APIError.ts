class APIError extends Error {
  public statusCode;
  public message;
  public status;
  public isOperational;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${String(statusCode).startsWith('4') ? 'fail' : 'error'}`;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

export default APIError;
