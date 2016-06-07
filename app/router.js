import Router from 'koa-router';
import User from './models/user';
import Post from './models/post';

const router = Router();

router.get('/', async (ctx, next) => {
  ctx.session.views = ++ctx.session.views || 0;
  await ctx.render('index.ejs', { views: ctx.session.views });
});

router
  .get('/register', async (ctx, next) => {
    await ctx.render('register.ejs');
  })
  .post('/register', async (ctx, next) => {
    const body = ctx.request.body;

    const newUser = new User({
      username: body.username,
      password: body.password,
      email:    body.email
    });

    await newUser.cryptPassword();
    try {
      await newUser.save();
      ctx.body = {
        success: true,
        redirect: '/'
      };
    } catch (err) {
      console.log(err);
      ctx.body = {
        success: false,
        errorMessage: err.message
      };
    }
  });

router
  .get('/login', async (ctx, next) => {
    await ctx.render('login.ejs');
  })
  .post('/login', async (ctx, next) => {
    user = await User.findOne(loginForm);
    if (user) {
      ctx.body = {
        success: true,
        redirect: '/'
      };
    } else {
      ctx.body = {
        success: false,
        errorMessage: 'fuck'
      };
    }
  });

router
  .get('/logout', async (ctx, next) => {
    ctx.session = null;
    ctx.redirect('/');
  });

router
  .get('/post', async (ctx, next) => {
    await ctx.render('post.ejs');
  });

// Restful api
router
  .get('/posts/', async (ctx, next) => {
    const posts = await Post.find();
    ctx.body = posts;
  })
  .post('/posts/', async (ctx, next) => {
    const body = ctx.request.body;
    const newPost = new Post({
      title: body.title,
      content: body.content
    });
    await newPost.save();
    ctx.body = {
      success: true
    };
  });

export default router;
