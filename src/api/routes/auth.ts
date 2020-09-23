import { Router } from 'express';

import * as authController from '../../controllers/authController';

const authRouter = Router();

export default (app: Router) => {
  app.use('/auth', authRouter);

  authRouter.post('/signup', authController.signup);
  authRouter.post('/signin', authController.signin);
};
