const router = require('koa-router')();
const User = require('./models/user');
const Post = require('./models/post');

router.get('/', loginRequired, async ctx => {
  await ctx.render('index.ejs', { user: ctx.session.user });
});

router.get('/chat', loginRequired, async ctx => {
  await ctx.render('chat.ejs');
});

router
  .get('/register', async ctx => {
    await ctx.render('register.ejs');
  })
  .post('/register', async ctx => {
    const body = ctx.request.body;

    const { type, user } = await register({
      username: body.username,
      password: body.password,
      email:    body.email
    });

    switch (type) {
      case 'success':
        ctx.session.user = user;
        return ctx.body = {
          success: true,
          redirect: '/'
        };
      case 'usernameError':
        return ctx.body = {
          success: false,
          errorMessage: 'User Exists!'
        };
      case 'emailError':
        return ctx.body = {
          success: false,
          errorMessage: 'Email has been registered!'
        };
      default:
        throw new Error('FATAL ERROR');
    }
  });

router
  .get('/login', async ctx => {
    await ctx.render('login.ejs');
  })
  .post('/login', async ctx => {
    const body = ctx.request.body;

    const { type, user } = await login({
      username: body.username,
      password: body.password,
    });

    switch (type) {
      case 'success':
        ctx.session.user = user;
        return ctx.body = {
          success: true,
          redirect: body.next
        };
      case 'usernameError':
        return ctx.body = {
          success: false,
          errorMessage: 'No such user.'
        };
      case 'passwordError':
        return ctx.body = {
          success: false,
          errorMessage: 'Wrong password'
        };
      default:
        throw new Error('FATAL ERROR!');
    }
  });

router
  .get('/logout', async ctx => {
    ctx.session = null;
    ctx.redirect('/login');
  });

router
  .get('/profile/:username', async ctx => {
    const user = await User.findOne({ username: ctx.params.username });
    if (user == null)
      return ctx.status = 404;
    await ctx.render('profile.ejs', { user: user });
  });

router
  .get('/post', loginRequired, async ctx => {
    await ctx.render('post.ejs');
  });

// Restful api
router
  .get('/posts/', async ctx => {
    const posts = await Post.find().populate('_creator', 'username');
    ctx.body = posts;
  })
  .post('/posts/', async ctx => {
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
    await ctx.redirect(`/login?next=${ctx.path}`);
}

async function logoutRequired(ctx, next) {
  if (ctx.session.user)
    await ctx.redirect('/');
  else
    return next();
}

function login(body) {
  return new Promise(async (resolve, reject) => {
    const user = await User.findOne({ username: body.username });
    if (!user) return resolve({ type: 'usernameError' });

    const passwordMatch = await user.comparePassword(body.password);
    if (!passwordMatch) return resolve({ type: 'passwordError' });

    return resolve({
      type: 'success',
      user: user
    });
  });
}

function register(body) {
  return new Promise(async (resolve, reject) => {
    let users = await User.find({ username: body.username });
    if (users.length !== 0) return resolve({ type: 'usernameError' });

    users = await User.find({ email: body.email });
    if (users.length !== 0) return resolve({ type: 'emailError' });

    const newUser = new User({
      username: body.username,
      password: body.password,
      email:    body.email
    });

    await newUser.cryptPassword();
    await newUser.save();
    return resolve({ type: 'success', user: newUser });
  });
}

module.exports = router;
