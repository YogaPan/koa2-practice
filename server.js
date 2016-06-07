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

// Catch errors and display message.
app.use(async (ctx, next) => {
  try {
    await next();
  } catch(err) {
    console.log(err);
    ctx.body = { message: err.message };
    ctx.status = err.status || 500;
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(8080, () => {
  console.log('Server listen on port 8080');
});
