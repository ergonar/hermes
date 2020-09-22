import { Router, NextFunction, Request, Response } from 'express';
import APIError from '../../utils/ApiError';
export default (app: Router) => {
  app.all('*', (req: Request, res: Response, next: NextFunction) => {
    next(new APIError(404, `Can't find ${req.originalUrl} on this server`));
  });
};
