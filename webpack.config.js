var path = require('path');

module.exports = {
  mode: 'development',
  entry: './js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.bundle.js'
  }
};
