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
		res.status(200).render('user/signup');
	}
});

router.post('/', async (req, res) => {
	if (req.session.user) {
		if (
			authenticatedUser(req.session.user.username, req.session.user.password)
		) {
			res.status(200).render('user/profile', { user: req.session.user });
		}
	} else {
		const user = await userData.create(
			req.body.username,
			req.body.firstName,
			req.body.lastName,
			req.body.password,
			req.body.age,
			req.body.country,
		);
		req.session.user = {
			id: user._id,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			age: user.age,
			country: user.country,
		};
		res.render('user/profile', { user: user });
	}
});

module.exports = router;
