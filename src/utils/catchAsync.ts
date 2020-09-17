import { NextFunction, Request, Response } from 'express';

const catchAsync = fn => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
