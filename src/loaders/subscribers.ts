import logger from './../utils/winston';

export default () => {
  process.on('unhandledRejection', error => {
    logger.error('There was an uncaught rejection: ', error);
    logger.on('finish', () => {
      process.exit(1);
    });
  });
};
