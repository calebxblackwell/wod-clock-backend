const chai = require('chai');
const chaiHttp = require('chai-http');
const {app} = require('../server');
const {user} = require('../router');

describe('/router', function(){
  const username = 'testuser';
  const password = 'testpassword';
})

//this part of the test starts and stops the server.
before(function() {
   return runServer();
 });
 after(function() {
   return closeServer();
 });
//this is the part of the test that sends a post request
//to reject users with no username
describe('/router', function() {
  describe('POST', function() {
        it('Rejects users without a username', function() {
          return chai
            .request(app)
            .post('/router')
            .send({
              password,
            })
            .then(() =>
              expect.fail(null, null, 'Request denied')
            )
            .catch(err => {
              if (err instanceof chai.AssertionError) {
                throw err;
              }

              const res = err.response;
              expect(res).to.have.status(422);
              expect(res.body.reason).to.equal('Not valid');
              expect(res.body.message).to.equal('Missing');
              expect(res.body.location).to.equal('username');
            });
        });
//this is the part that rejects users with a missing password.
        it('Rejects users without a password', function() {
            return chai
              .request(app)
              .post('/router')
              .send({
                username,
              })
              .then(() =>
              expect.fail(null, null, 'Request denied')
          )
            .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('Not valid');
            expect(res.body.message).to.equal('Missing');
            expect(res.body.location).to.equal('password');
          });
      });
//this is the part that rejects users based off of the type of username.
      it('Rejects users with non-string username', function() {
   return chai
     .request(app)
     .post('/router')
     .send({
       username: 123456,
       password,
     })
     .then(() =>
       expect.fail(null, null, 'Request denied')
     )
     .catch(err => {
       if (err instanceof chai.AssertionError) {
         throw err;
       }

       const res = err.response;
       expect(res).to.have.status(422);
       expect(res.body.reason).to.equal('Not valid');
       expect(res.body.message).to.equal(
         'Incorrect field type: expected string'
       );
       expect(res.body.location).to.equal('username');
     });
 });
//this is the part that rejects users with wrong type of password.
it('Rejects users with non-string password', function() {
        return chai
          .request(app)
          .post('/router')
          .send({
            username,
            password: 123456,
          })
          .then(() =>
            expect.fail(null, null, 'Request denied')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('Not valid');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('password');
          });
      });
//this part rejects users with usernames with spaces
it('Rejects users with non-trimmed username', function() {
        return chai
          .request(app)
          .post('/router')
          .send({
            username: ` ${username} `,
            password,
          })
          .then(() =>
            expect.fail(null, null, 'Request denied')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('Not valid');
            expect(res.body.message).to.equal(
              'Cannot start or end with whitespace'
            );
            expect(res.body.location).to.equal('username');
          });
      });
//this part rejects users with passwords with spaces
it('Rejects users with non-trimmed password', function() {
       return chai
         .request(app)
         .post('/router')
         .send({
           username,
           password: ` ${password} `,
         })
         .then(() =>
           expect.fail(null, null, 'Request denied')
         )
         .catch(err => {
           if (err instanceof chai.AssertionError) {
             throw err;
           }

           const res = err.response;
           expect(res).to.have.status(422);
           expect(res.body.reason).to.equal('Not valid');
           expect(res.body.message).to.equal(
             'Cannot start or end with whitespace'
           );
           expect(res.body.location).to.equal('password');
         });
     });
//this part rejects users without a username
it('Rejects users with empty username field', function() {
        return chai
          .request(app)
          .post('/router')
          .send({
            username: '',
            password,
          })
          .then(() =>
            expect.fail(null, null, 'Request denied')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('Not valid');
            expect(res.body.message).to.equal(
              'Must be at least 1 characters long'
            );
            expect(res.body.location).to.equal('username');
          });
      });
//this part rejects users with passwords that are too short.
it('Rejects users with password less than ten characters', function() {
       return chai
         .request(app)
         .post('/router')
         .send({
           username,
           password: '123456789',
         })
         .then(() =>
           expect.fail(null, null, 'Request denied')
         )
         .catch(err => {
           if (err instanceof chai.AssertionError) {
             throw err;
           }

           const res = err.response;
           expect(res).to.have.status(422);
           expect(res.body.reason).to.equal('Not valid');
           expect(res.body.message).to.equal(
             'Must be at least 10 characters long'
           );
           expect(res.body.location).to.equal('password');
         });
     });
//this part rejects users with passwords that are too long.
it('Rejects users with password greater than 72 characters', function() {
        return chai
          .request(app)
          .post('/router')
          .send({
            username,
            password: new Array(73).fill('a').join(''),
          })
          .then(() =>
            expect.fail(null, null, 'Request denied')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('Not valid');
            expect(res.body.message).to.equal(
              'Cannot be more than 72 characters long'
            );
            expect(res.body.location).to.equal('password');
          });
      });
//this test tries to create more than one user with the same name.
it('Rejects users with duplicate username', function() {
   // Create first user
   return User.create({
     username,
     password,
   })
     .then(() =>
       // Try to create a second user with the same username
       chai.request(app).post('/router').send({
         username,
         password,
       })
     )
     .then(() =>
       expect.fail(null, null, 'Request denied')
     )
     .catch(err => {
       if (err instanceof chai.AssertionError) {
         throw err;
       }

       const res = err.response;
       expect(res).to.have.status(422);
       expect(res.body.reason).to.equal('Not valid');
       expect(res.body.message).to.equal(
         'Username already taken'
       );
       expect(res.body.location).to.equal('username');
     });
 });
//this test actually creates a new user, with correct info.
it('Creates a new user', function() {
        return chai
          .request(app)
          .post('/router')
          .send({
            username,
            password,
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username',
            );
            expect(res.body.username).to.equal(username);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });

//this tests the GET function with the test user info
describe('GET', function() {
  it('Returns an empty array initially', function() {
    return chai.request(app).get('/router').then(res => {
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.length(0);
    });
  });
  it('Returns an array of users', function() {
    return User.create(
      {
        username,
        password,
      }
    )
      .then(() => chai.request(app).get('/router'))
      .then(res => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.have.length(2);
        expect(res.body[0]).to.deep.equal({
          username,
        });
        expect(res.body[1]).to.deep.equal({
          username: usernameB,
        });
      });
  });
});
});
//end.
});
