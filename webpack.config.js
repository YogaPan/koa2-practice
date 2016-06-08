module.exports = {
  entry: {
    loginApp: './public/js/src/loginApp.js',
    registerApp: './public/js/src/registerApp.js',
    postApp: './public/js/src/postApp.js'
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
          presets: ['react', 'es2015', 'stage-0']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
}
