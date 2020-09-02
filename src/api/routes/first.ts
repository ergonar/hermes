import { Router, Request, Response } from 'express';

const router = Router();

export default (app: Router) => {
  app.use('/first', router);

  router.get('/hey', (req: Request, res: Response) => {
    return res.status(200).json({
      message: 'Hello Typescript',
    });
  });
};
