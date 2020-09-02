import * as dotenv from 'dotenv';
import * as path from 'path';

const envFound = dotenv.config({ path: path.join(__dirname, 'config.env') });
if (envFound.error) {
  throw new Error('Could not find .env file');
}

export default {
  port: process.env.PORT,

  api: {
    prefix: '/api',
  },
};
