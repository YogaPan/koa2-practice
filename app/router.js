import Router from 'koa-router';
import User from './models/user';

const router = Router();

router.get('/', async (ctx, next) => {
  await ctx.render('index.ejs');
});

router
  .get('login', async (ctx, next) => {
    await ctx.render('login.ejs');
  })
  .post('login', async (ctx, next) => {
    ctx.body = {
      success: true,
      redirect: '/'
    };
  });

router
  .get('register', async (ctx, next) => {
    await ctx.render('register.ejs');
  })
  .post('register', async (ctx, next) => {

  });

export default router;
