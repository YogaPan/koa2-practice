const should = require('chai').should();
const request = require('request');

describe('Router', () => {
  describe('/', () => {
    it('Should return status code 200 OK', (done) => {
      request
        .get('http://localhost:8080/')
        .on('response', (res) => {
          res.statusCode.should.be.a('number');
          res.statusCode.should.equal(200);
          done();
        });
    });
  });

  describe('/login', () => {
    it('Should return status code 200 OK', (done) => {
      request
        .get('http://localhost:8080/login')
        .on('response', (res) => {
          res.statusCode.should.be.a('number');
          res.statusCode.should.equal(200);
          done();
        });
    });
  });

  describe('/logout', () => {
    it('Should return status code 200 OK', (done) => {
      request
        .get('http://localhost:8080/logout')
        .on('response', (res) => {
          res.statusCode.should.be.a('number');
          res.statusCode.should.equal(200);
          done();
        });
    });
  });

  describe('/register', () => {
    it('Should return status cide 200 OK', (done) => {
      request
        .get('http://localhost:8080/register')
        .on('response', (res) => {
          res.statusCode.should.be.a('number');
          res.statusCode.should.equal(200);
          done();
        });
    });
  });

  describe('/404-page', () => {
    it('Should return status code 404 Not Found', (done) => {
      request
        .get('http://localhost:8080/404-page')
        .on('response', (res) => {
          res.statusCode.should.be.a('number');
          res.statusCode.should.equal(404);
          done();
        });
    });
  });
});
