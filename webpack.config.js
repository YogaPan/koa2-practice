module.exports = {
  entry: {
    loginApp: ['babel-polyfill', './public/js/src/loginApp.js'],
    registerApp: ['babel-polyfill', './public/js/src/registerApp.js'],
    postApp: ['babel-polyfill', './public/js/src/postApp.js']
  },
  output: {
    path: './public/js/dist',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        query: {
          presets: ['react', 'es2015', 'stage-0', 'stage-3']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  },
}
