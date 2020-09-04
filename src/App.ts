const express = require('express');

import config from './config';
import logger from './utils/winston';

async function startServer() {
  const app = express();

  await require('./loaders').default({ expressApp: app });

  const server = app.listen(config.port, '0.0.0.0', error => {
    if (error) {
      logger.error(error);
      process.exit(1);
    }

    logger.info(`Running on port ${config.port}`);
  });

  return server;
}

const server = startServer();

export default server;
