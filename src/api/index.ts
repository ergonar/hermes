import { Router } from 'express';
import first from './routes/first';

export default () => {
  const router = Router();
  first(router);

  return router;
};
