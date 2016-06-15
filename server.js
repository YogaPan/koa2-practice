const Koa = require('Koa');
const logger = require('koa-logger');
const views = require('koa-views');
const serve = require('koa-static');
const router = require('./app/router');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const convert = require('koa-convert');
const mongoose = require('mongoose');

const path = require('path');
const http = require('http');

// Create a new koa application.
const app = new Koa;

// Connect to localhost mongodb.
mongoose.connect('mongodb://localhost/test');

// Show all request, include path, status code and spent time.
app.use(logger());

// Parse post form as json.
app.use(bodyParser());

// Use ejs as template engines.
app.use(views(path.join(__dirname, '/views'), {
  map: { ejs: 'ejs' }
}));

// Serve static files in "public" directory.
app.use(serve(path.join(__dirname, '/public')));

// Set secret key and use koa-session.
// NOTE: In product, this secret key MUST CHANGE and add to .gitignore file.
app.keys = ['You never know.'];
app.use(convert(session(app)));

// Catch all unhandled server internal errors and display message.
//app.env = 'product';
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;

    // Show message to server side.
    console.log(err);

    // Show message to client side.
    // NOTE: THis only enable when in "development" env.
    // Get rid of this feature, set app.env = "product".
    if ('development' === app.env) {
      switch (ctx.accepts('html', 'json')) {
        case 'html':
          ctx.type = 'html';
          ctx.body = `<p>${err.message}</p>`;
          break;
        case 'json':
          ctx.type = 'json';
          ctx.body = { message: err.message };
          break;
        default:
          ctx.type = 'text';
          ctx.body = err.message;
      }
    } else {
      switch (ctx.accepts('html', 'json')) {
        case 'html':
          ctx.type = 'html';
          ctx.body = '<p>Server Internal Error</p>';
          break;
        case 'json':
          ctx.type = 'json';
          ctx.body = { message: 'Server Internal Error' };
          break;
        default:
          ctx.type = 'text';
          ctx.body = 'Server Internal Error';
      }
    }
  }
});

// 404 Not Found Page.
app.use(async (ctx, next) => {
  await next();

  if (404 !== ctx.status)
    return;
  ctx.status = 404;

  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.type = 'html';
      ctx.body = '<p>404 Page Not Found</p>';
      break;
    case 'json':
      ctx.type = 'json';
      ctx.body = { message: '404 Page Not Found' };
      break;
    default:
      ctx.type = 'text';
      ctx.body = '404 Page Not Found';
  }
});

// Use koa-router.
app
  .use(router.routes())
  .use(router.allowedMethods());

// Start Server listen.
const port = process.env.PORT || 8080;
const server = http.Server(app.callback());

const io = require('socket.io')(server);

io.on('connection', socket => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
