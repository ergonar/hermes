import express from 'express';

import globalErrorHandler from '../controllers/errorController';

export default ({ app }: { app: express.Application }) => {
  app.use(globalErrorHandler);

  return app;
};
