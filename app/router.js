const router = require('koa-router')();
const User = require('./models/user');
const Post = require('./models/post');

router.get('/', loginRequired, async (ctx) => {
  await ctx.render('index.ejs', { user: ctx.session.user });
});

router.get('/chat', async (ctx) => {
  await ctx.render('chat.ejs');
});

router
  .get('/register', async (ctx) => {
    await ctx.render('register.ejs');
  })
  .post('/register', async (ctx) => {
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
  .get('/login', async (ctx) => {
    await ctx.render('login.ejs');
  })
  .post('/login', async (ctx) => {
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
      redirect: body.next
    };
  });

router
  .get('/logout', async (ctx) => {
    ctx.session = null;
    ctx.redirect('/login');
  });

router
  .get('/profile/:username', async (ctx) => {
    const user = await User.findOne({ username: ctx.params.username });
    if (user == null)
      return ctx.status = 404;
    await ctx.render('profile.ejs', { user: user });
  });

router
  .get('/post', loginRequired, async (ctx) => {
    await ctx.render('post.ejs');
  });

// Restful api
router
  .get('/posts/', async (ctx) => {
    const posts = await Post.find().populate('_creator', 'username');
    ctx.body = posts;
  })
  .post('/posts/', async (ctx) => {
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

module.exports = router;
