import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import 'whatwg-fetch';

const POST_FAIL = 'POST_FAIL';
const POST_SUCCESS = 'POST_SUCCESS';
const POST_LOAD = 'POST_LOAD';

function postFail(errorMessage) {
  return {
    type: POST_FAIL,
    errorMessage
  };
}

function postSuccess() {
  return {
    type: POST_SUCCESS,
  };
}

function postLoad(posts) {
  return {
    type: POST_LOAD,
    posts
  };
}

const initialState = {
  errorMessage: '',
  posts: []
};

function postReducer(state = initialState, action = {}) {
  switch (action.type) {
    case POST_FAIL:
      return Object.assign({}, state, {
        errorMessage: action.errorMessage
      });
    case POST_SUCCESS:
      return Object.assign({}, state, {
        errorMessage: ''
      });
    case POST_LOAD:
      return Object.assign({}, state, {
        posts: action.posts
      });
    default:
      return state;
  }
}

const store = createStore(postReducer);

class PostItem extends Component {
  static propTypes = {
    post: PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      _creator: PropTypes.shape({
        username: PropTypes.string.isRequired
      }).isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    }).isRequired
  };

  render() {
    const { title, content, _creator, createdAt, updatedAt } = this.props.post;

    return (
      <div>
        <p>{title}</p>
        <p>{createdAt}</p>
        <p>{content}</p>
        <a href={'/profile/' + _creator.username}>{_creator.username}</a>
      </div>
    );
  }
}

class PostList extends Component {
  static propTypes = {
    postLoad: PropTypes.func.isRequired,
    posts: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      _creator: PropTypes.shape({
        username: PropTypes.string.isRequired
      }).isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    }).isRequired).isRequired
  };

  async componentDidMount() {
    const { postLoad } = this.props
    let response = await fetch('/posts/', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    response = await response.json();
    return postLoad(response);
  }

  render() {
    const { posts } = this.props;
    const postElements = posts.map((post, idx) => (
      <li key={idx}>
        <PostItem post={post} />
      </li>
    ));
    return (
      <div>
        <ul>{postElements}</ul>
      </div>
    );
  }
}

class PostForm extends Component {
  render() {
    return (
      <form id="postForm" method="POST" onSubmit={::this.handleSubmit}>
        Title: <input type="text" ref="title" /><br/>
        Content: <input type="text" ref="content" /><br/>
        <button type="submit">Post</button>
      </form>
    );
  }

  handleSubmit(e) {
    e.preventDefault();

    const { postSuccess, postFail } = this.props;

    const titleNode = this.refs.title;
    const contentNode = this.refs.content;

    const title = titleNode.value;
    const content = contentNode.value;

    if (title === '')
      return postFail('No title');
    if (content === '')
      return postFail('No content');

    titleNode.value = '';
    contentNode.value = '';

    fetch('/posts/', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        content
      })
    }).then((response) => response.json())
      .then((response) => {
        if (response.success) {
          return postSuccess();
        } else {
          return postFail(response.errorMessage);
        }
      });
  }
}

class PostApp extends Component {
  static propTypes = {
    errorMessage: PropTypes.string.isRequired,
    actions: PropTypes.shape({
      postSuccess: PropTypes.func,
      postFail: PropTypes.func,
      postLoad: PropTypes.func
    }).isRequired,
    posts: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      _creator: PropTypes.shape({
        username: PropTypes.string.isRequired
      }).isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    }).isRequired).isRequired
  };

  render() {
    const { errorMessage, posts, actions } = this.props;

    return (
      <div>
        <h1>{errorMessage}</h1>
        <PostList
            postLoad={actions.postLoad}
            posts={posts}
        />
        <PostForm
            postSuccess={actions.postSuccess}
            postFail={actions.postFail}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.errorMessage,
    posts: state.posts,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      postFail,
      postSuccess,
      postLoad
    }, dispatch)
  };
}

PostApp = connect(mapStateToProps, mapDispatchToProps)(PostApp);

render(
  <Provider store={store}>
    <PostApp />
  </Provider>,
  document.getElementById('postApp')
);
