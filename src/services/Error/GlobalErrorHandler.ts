import { Service } from 'typedi';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

import APIError from '../../utils/ApiError';
import config from '../../config';
import logger from '../../utils/winston';
import { CastError } from 'mongoose';

@Service()
class GlobalErrorHandler {
  public sendErrorDev(error: APIError, req: Request, res: Response) {
    if (req.originalUrl.startsWith(config.api.prefix)) {
      return res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stack: error.stack,
        error,
      });
    }
    logger.info(`Trying to use invalid url | ${error.stack}`);
    return res.status(404).json({
      status: error.status,
      message: 'URL Not Found',
      stack: error.stack,
      error,
    });
  }

  public sendErrorProd(error: APIError, req: Request, res: Response) {
    if (req.originalUrl.startsWith(config.api.prefix)) {
      // Operational, trusted error: send message to client
      if (error.isOperational) {
        return res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
      // Programming or other unknown error: don't leak error details
      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    } else if (error.isOperational) {
      logger.info(`Trying to use invalid url | ${error.stack}`);
      return res.status(404).json({
        status: error.status,
        message: 'URL Not Found',
      });
    }
  }

  public handleErrorProd(err: any, req: Request, res: Response) {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (error.name === 'CastError') {
      error = this.handleCastErrorDb(error);
    } else if (error.code === 11000) {
      error = this.handleDuplicateFieldsDB(error);
    } else if (error.name === 'ValidationError') {
      error = this.handleValidationErrorDB(error);
      // } else if (error.name === 'JsonWebTokenError') {
      //   error = handleJWTError();
      // } else if (error.name === 'TokenExpiredError') {
      //   error = handleJWTExpiredError();
    }

    this.sendErrorProd(error, req, res);
  }

  private handleCastErrorDb(error: CastError): APIError {
    const message = `Invalid ${error.path}: ${error.value}.`;
    return new APIError(400, message);
  }

  private handleDuplicateFieldsDB(error) {
    const value = error.message.match(/(["'])(\\?.)*?\1/)[0];
    const message = `Duplicate field value: ${value}. Use another value`;
    return new APIError(400, message);
  }

  private handleValidationErrorDB(
    err: mongoose.Error.ValidationError
  ): APIError {
    const errors = Object.values(err.errors).map(error => error.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new APIError(400, message);
  }
}

export default GlobalErrorHandler;
