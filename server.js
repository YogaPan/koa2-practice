import Koa from 'Koa';
import views from 'koa-views';
import logger from 'koa-logger';
import serve from 'koa-static';
import path from 'path';
import mongoose from 'mongoose';
import router from './app/router';

const app = new Koa();

mongoose.connect('mongodb://localhost/test');

app.use(logger());
app.use(serve(path.join(__dirname, '/public')));

app.use(views(path.join(__dirname, '/views'), {
  map: { ejs: 'ejs' }
}));

app.use(async (ctx, next) => {
  try {
    await next();
  } catch(err) {
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
