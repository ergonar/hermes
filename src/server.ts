import * as dotenv from 'dotenv';
import * as path from 'path';
import app from './App';

dotenv.config({ path: path.join(__dirname, './../src/config/config.env') });

const port = process.env.PORT;

const server = app.listen(port, '0.0.0.0', error => {
  if (error) {
    return console.log(error);
  }

  return console.log(`Running on port ${port}`);
});
