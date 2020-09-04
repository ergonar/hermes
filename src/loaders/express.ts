import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import routes from '../api';
import config from '../config';

export default ({ app }: { app: express.Application }) => {
  app.use(cors());
  app.use(bodyParser.json());

  // Load API Routes
  app.use(config.api.prefix, routes());

  return app;
};
