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
      node_env: process.env.NODE_ENV,
      port: process.env.PORT,

      jwtSecret: process.env.JWT_SECRET,
      jwtExpiresIn: process.env.JWT_EXPIRES_IN,
      jwtCookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN,

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
