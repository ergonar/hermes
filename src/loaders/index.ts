import expressLoader from './express';
import { mongooseDatabase as mongooseLoader } from './mongoose';
import subscribersLoader from './subscribers';

import logger from '../utils/winston';

export default async ({ expressApp }) => {
  try {
    subscribersLoader();
    logger.info('Subscribers Loaded!');

    expressLoader({ app: expressApp });
    logger.info('Express Initialized!');

    await mongooseLoader();
    logger.info('Database Loaded and Connected!');
  } catch (error) {
    logger.error('Error while initializing loaders: ', error);
  }
};
