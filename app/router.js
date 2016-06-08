import Router from 'koa-router';
import User from './models/user';
import Post from './models/post';

const router = Router();

router.get('/', async (ctx, next) => {
  console.log(ctx.session);
  await ctx.render('index.ejs', { user: ctx.session.user });
});

router
  .get('/register', async (ctx, next) => {
    await ctx.render('register.ejs');
  })
  .post('/register', async (ctx, next) => {
    const body = ctx.request.body;

    let users = await User.find({ username: body.username });
    if (users.length !== 0) {
      return ctx.body = {
        success: false,
        errorMessage: 'User Exists!'
      };
    }
    users = await User.find({ email: body.email });
    if (users.length !== 0) {
      return ctx.body = {
        success: false,
        errorMessage: 'Email has been registered!'
      };
    }

    const newUser = new User({
      username: body.username,
      password: body.password,
      email:    body.email
    });

    try {
      await newUser.cryptPassword();
      await newUser.save();
      ctx.body = {
        success: true,
        redirect: '/'
      };
    } catch (err) {
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
    const body = ctx.request.body;

    const user = await User.findOne({ username: body.username });

    if (!user) {
      return ctx.body = {
        success: false,
        errorMessage: 'No such user.'
      };
    }

    const passwordMatch = await user.comparePassword(body.password);

    if (!passwordMatch) {
      return ctx.body = {
        success: false,
        errorMessage: 'Wrong password'
      };
    }

    ctx.session.user = user;
    return ctx.body = {
      success: true,
      redirect: '/'
    };
  });

router
  .get('/logout', async (ctx, next) => {
    ctx.session = null;
    ctx.redirect('/');
  });

router
  .get('/post', loginRequired, async (ctx, next) => {
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
    const creator = await User.findById(ctx.session.user._id);

    const newPost = new Post({
      _creator: creator._id,
      title: body.title,
      content: body.content
    });

    creator.posts.push(newPost._id);

    await newPost.save();
    await creator.save();
    ctx.body = {
      success: true
    };
  });

async function loginRequired(ctx, next) {
  if (ctx.session.user)
    return next();
  else
    await ctx.redirect('/');
}

async function logoutRequired(ctx, next) {
  if (ctx.session.user)
    await ctx.redirect('/');
  else
    return next();
}

export default router;
