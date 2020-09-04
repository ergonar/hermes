import * as dotenv from 'dotenv';
import * as path from 'path';

import logger from '../utils/winston';

const loadEnvVariables = () => {
  try {
    const envFound = dotenv.config({
      path: path.join(__dirname, 'config.env'),
    });
    if (envFound.error) {
      throw new Error(`${envFound.error}`);
    }

    return {
      port: process.env.PORT,

      databaseUrl: process.env.DATABASE_URL,
      databasePassword: process.env.DATABASE_PASSWORD,

      mongoTestUrl: process.env.MONGO_URL,

      api: {
        prefix: '/api',
      },
    };
  } catch (error) {
    logger.error(`Error while initializing .env variables\n`, error);
  }
};

export default loadEnvVariables();
