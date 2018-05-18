const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Status = require('./models/status');
const config = require('../config');
const router = express.Router();

const createAuthToken = function(user) {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};
const localAuth = passport.authenticate('local', {session: false});
router.use(bodyParser.json());
// The user provides a username and password to login
router.post('/login', localAuth, (req, res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({authToken});
});

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.post('/refresh', jwtAuth, (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});
//this indicates that you need a username and password in order to continue
router.post('/', jsonParser, (req, res) =>{
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));
    if (missingField) {
      return res.status(422).json({
        code:422,
        reason:'Cannot validate',
        message: 'Missing required info',
        location: missingField
      });
    }
//this indicates that all of the fields are strings.
    const stringFields = ['username', 'password'];
    const nonStringField = stringFields.find(
      field => field in req.body && typeof req.body[field] !== 'string'
    );
    if (nonStringField) {
      return res.status(422).json({
      code: 422,
      reason: 'Cannot validate',
      message: 'Expected a string',
      location: nonStringField
      });
    }
//this indicates that there's no spaces before the username and password
    const explicityTrimmedFields = ['username', 'password'];
    const nonTrimmedField = explicityTrimmedFields.find(
      field => req.body[field].trim() !== req.body[field]
    );
    if (nonTrimmedField) {
      return res.status(422).json({
      code: 422,
      reason: 'Cannot Validate',
      message: 'Cannot start or end with spaces',
      location: nonTrimmedField
    });
  }
//this controls the size of the username and password
    const sizedFields = {
        username: {
          min: 1
        },
        password: {
          min: 10,
          max: 72
        }
      };
//this is what happens when the password is too small
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
          req.body[field].trim().length < sizedFields[field].min
        );
//this is what happens when the password is too long.
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
           req.body[field].trim().length > sizedFields[field].max
         );
//this is what you're prompted with if your inputs are too large or small.
    if (tooSmallField || tooLargeField) {
      return res.status(422).json({
        code: 422,
        reason: 'Cannot be validated.',
        message: tooSmallField
          ? `Must be at least ${sizedFields[tooSmallField]
            .min} characters long`
          : `Must be at most ${sizedFields[tooLargeField]
            .max} characters long`,
              location: tooSmallField || tooLargeField
            });
          }
//this trims the too-long inputs.
    let {username, password, firstName = '', lastName = ''} = req.body;
          firstName = firstName.trim();
          lastName = lastName.trim();
//this lets you know if there's already a user with that name.
    return User.find({username})
      .count()
        .then(count => {
          if (count > 0) {
            return Promise.reject({
              code: 422,
              reason: 'ValidationError',
              message: 'Username already taken',
              location: 'username'
            });
          }
//If the username works, then you hash the password to keep it secret.
    return User.hashPassword(password);
      })
      .then(hash => {
        return User.create({
          username,
          password: hash,
          firstName,
          lastName
        });
      })
      .then(user => {
        return res.status(201).json(user.serialize());
      })
      .catch(err => {
        if (err.reason === 'ValidationError') {
          return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });
});
module.exports = {router};
});
