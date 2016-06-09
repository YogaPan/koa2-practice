import Koa from 'Koa';
import views from 'koa-views';
import logger from 'koa-logger';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import session from 'koa-session';
import convert from 'koa-convert';

import path from 'path';
import mongoose from 'mongoose';
import router from './app/router';

mongoose.connect('mongodb://localhost/test');

const app = new Koa();

app.keys = ['You never know'];
app.use(convert(session(app)));

app.use(logger());
app.use(serve(path.join(__dirname, '/public')));
app.use(bodyParser());

app.use(views(path.join(__dirname, '/views'), {
  map: { ejs: 'ejs' }
}));

// Catch all unhandled server internal errors and display message.
app.use(async (ctx, next) => {
  try {
    await next();
  } catch(err) {
    ctx.status = err.status || 500;

    // Show message to server side.
    console.log(err);

    // Show message to client side.
    // Note: This only enable when in debug mode.
    switch (ctx.accepts('html', 'json')) {
      case 'html':
        ctx.type = 'html';
        ctx.body = `<p>${err.message}</p>`;
      case 'json':
        ctx.type = 'json';
        ctx.body = { message: err.message };
      default:
        ctx.type = 'text';
        ctx.body = err.message;
    }
  }
});

// 404 Not found page
app.use(async (ctx, next) => {
  await next();

  if (ctx.status != 404)
    return;

  ctx.status = 404;

  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.type = 'html';
      ctx.body = '<p>Page Not Found</p>'
      break;
    case 'json':
      ctx.type = 'json';
      ctx.body = { message: 'Page Not Found' };
      break;
    default:
      ctx.type = 'text';
      ctx.body = 'Page Not Found';
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080, () => {
  console.log('Server listen on port 8080');
});
