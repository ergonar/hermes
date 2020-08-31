const app = require('./app');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, 'src/config/config.env') });

const port = process.env.PORT;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Running on port ${port}`);
});
