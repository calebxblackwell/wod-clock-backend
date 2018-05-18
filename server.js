const express = require('express');
const app = express();
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const config = require('./config');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
mongoose.connect(config.DATABASE_URL);
//line 14 uses express cors middleware to make the client origin configurable.
app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);
//this sets up passport and jwt in case we need password and user info with api
const {
	localStrategy,
	jwtStrategy
} = require('./strategy');
passport.use(localStrategy);
passport.use(jwtStrategy);

//endpoints!!!
//line 27 will show a json object with program info
app.get('/api/programs', (req,res) => {
  res.json({programs: yes});
})
//
let server;
//creating a new user
app.post('/users/authenticate', (req, res) => {
	let {
		username,
		password
	} = req.body;
	// Username and password come in pre-trimmed, otherwise we throw an error
	// before this
	return User.find({
		username
	}).count()
		.then(count => {
		if (count > 0) {
			// There is an existing user with the same username
			return Promise.reject({
				code: 422,
				reason: 'ValidationError',
				message: 'Username already taken',
				location: 'username'
			});
		}
		// If there is no existing user, hash the password
		return User.hashPassword(password);
	}).then(hash => {
		return User.create({
			username,
			password: hash,
		});
	}).then(user => {
		return res.status(201).json(user.serialize());
	}).catch(err => {
		// Forward validation errors on to the client, otherwise give a 500
		// error because something unexpected has happened
		if (err.reason === 'ValidationError') {
			return res.status(err.code).json(err);
		}
		res.status(500).json({
			code: 500,
			message: 'Internal server error'
		});
	});
});
//user sign in area
const createAuthToken = function(user) {
	return jwt.sign({
		user
	}, config.JWT_SECRET, {
		subject: user.username,
		expiresIn: config.JWT_EXPIRY,
		algorithm: 'HS256'
	});
};
const localAuth = passport.authenticate('local', {
	session: false
});
app.post('/users/authenticate', localAuth, (req, res) => {
	const authToken = createAuthToken(req.user.serialize());
	res.json({
		authToken,
		username: req.user.username
	});
});

//below is info to run the server
function runServer() {
	const port = process.env.PORT || 8080;
	return new Promise((resolve, reject) => {
		server = app.listen(port, () => {
			console.log(`Your app is listening on port ${8080}`);
			resolve(server);
		}).on('error', err => {
			reject(err);
		});
	});
}

function closeServer() {
	return new Promise((resolve, reject) => {
		console.log('Closing server');
		server.close(err => {
			if (err) {
				reject(err);
				return;
			}
			resolve();
		});
	});
}
if (require.main === module) {
	runServer().catch(err => console.error(err));
}
module.exports = {
	runServer,
	app,
	closeServer
};
