import * as dotenv from 'dotenv';
import * as path from 'path';

const envFound = dotenv.config({ path: path.join(__dirname, 'config.env') });
if (envFound.error) {
  throw new Error('Could not find .env file');
}

export default {
  port: process.env.PORT,

  databaseUrl: process.env.DATABASE_URL,
  databasePassword: process.env.DATABASE_PASSWORD,

  mongoTestUrl: process.env.MONGO_URL,

  api: {
    prefix: '/api',
  },
};
