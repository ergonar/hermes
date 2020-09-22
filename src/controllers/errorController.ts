import { NextFunction, Request, Response } from 'express';
import Container from 'typedi';
import config from '../config';
import GlobalErrorHandler from '../services/Error/GlobalErrorHandler';
import APIError from '../utils/ApiError';
import logger from '../utils/winston';

const errorController = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const globalErrorHandler = Container.get(GlobalErrorHandler);
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  logger.error(
    `Status code: ${error.statusCode}\n Stack trace: ${error.stack}`
  );

  if (config.node_env === 'development' || config.node_env === 'test') {
    globalErrorHandler.sendErrorDev(error, req, res);
  } else if (config.node_env === 'production') {
    globalErrorHandler.handleErrorProd(error, req, res);
  }
};

export default errorController;
