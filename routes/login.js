const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const bcrypt = require('bcryptjs');

function validateFormData(inputUsername, inputPassword) {
	if (typeof inputUsername !== 'string' || !inputUsername.trim()) {
		throw 'Invalid username';
	}
	if (typeof inputPassword !== 'string' || !inputPassword.trim()) {
		throw 'Invalid password';
	}
}

async function authenticatedUser(inputUsername, inputPassword) {
	validateFormData(inputUsername, inputPassword);
	let presentUser = false;
	for (let user of await userData.getAllUsers()) {
		if (
			user.username.toLowerCase() == inputUsername.toLowerCase() &&
			(await bcrypt.compare(inputPassword, user.password))
		) {
			presentUser = true;
		}
	}
	return presentUser;
}

router.get('/', async (req, res) => {
	if (req.session.user) {
		if (
			authenticatedUser(req.session.user.username, req.session.user.password)
		) {
			res.status(200).render('user/profile', { user: req.session.user });
		}
	} else {
		res.render('user/login');
	}
});

router.post('/', async (req, res) => {
	console.log('POST login');
	// if successful username + password
	if (await authenticatedUser(req.body.username, req.body.password)) {
		// set AuthCookie
		let currUser;
		for (let user of await userData.getAllUsers()) {
			if (
				user.username.toLowerCase() == req.body.username &&
				(await bcrypt.compare(req.body.password, user.password))
			) {
				currUser = user;
			}
		}
		req.session.user = {
			id: currUser._id,
			username: currUser.username,
			firstName: currUser.firstName,
			lastName: currUser.lastName,
			age: currUser.age,
			country: currUser.country,
		};
		res.status(200).render('user/profile', { user: req.session.user });
	} else {
		// if not successful
		res.status(401).render('user/login');
		// error message with HTTP 401
	}
});

module.exports = router;
