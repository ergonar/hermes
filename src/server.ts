import config from './config/server.config';
import app from './App';

const server = app.listen(config.port, '0.0.0.0', error => {
  if (error) {
    return console.log(error);
  }

  return console.log(`Running on port ${config.port}`);
});
