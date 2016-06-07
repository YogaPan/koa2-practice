module.exports = {
  entry: {
    loginForm: './public/js/src/loginForm.js',
    registerForm: './public/js/src/registerForm.js',
    postForm: './public/js/src/postForm.js'
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
          presets: ['react', 'es2015']
        }
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
}
