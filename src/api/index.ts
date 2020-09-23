import { Router } from 'express';
import all from './routes/all';
import auth from './routes/auth';

export default () => {
  const router = Router();
  auth(router);

  all(router);
  return router;
};
