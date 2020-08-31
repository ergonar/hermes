const path = require('path');

module.exports = {
  entry: './public/js/main.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'public/js'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
