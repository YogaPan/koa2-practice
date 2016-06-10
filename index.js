require('babel-core/register')({
  presets: ['es2015', 'stage-0', 'stage-3']
});
require("babel-polyfill");

require('./server.js');
