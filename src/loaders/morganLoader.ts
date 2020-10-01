import express from 'express';
import morgan from 'morgan';

const rfs = require('rotating-file-stream');

const morganLoader = (app: express.Application) => {
  // Create a rotating write stream
  const requestsLogStream = rfs.createStream('requests.log', {
    interval: '1d', // Rotate daily
    path: './src/log/requests',
  });

  app.use(morgan('combined', { stream: requestsLogStream }));
};

export default morganLoader;
