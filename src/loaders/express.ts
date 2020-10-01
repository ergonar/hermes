import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import routes from '../api';
import config from '../config';
import globalErrorHandler from '../controllers/errorController';
import morganLoader from './morganLoader';

export default ({ app }: { app: express.Application }) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use(cookieParser());

  morganLoader(app);

  // Load API Routes
  app.use(config.api.prefix, routes());

  // API Error Handler
  app.use(globalErrorHandler);

  return app;
};
