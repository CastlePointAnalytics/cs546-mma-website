const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const bcrypt = require('bcryptjs');
const saltRounds = 2;

function validateFormData(inputUsername, inputPassword) {
	if (typeof inputUsername !== 'string' || !inputUsername.trim()) {
		alert("Please enter a valid username.");
		throw 'Invalid username';
	}
	if (typeof inputPassword !== 'string' || !inputPassword.trim()) {
		alert("Please enter a valid password.");
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

async function uniqueUsername(inputUsername) {
	let uniqueUsername = true;
	for (let user of await userData.getAllUsers()) {
		if (user.username.toLowerCase() == inputUsername.toLowerCase()) {
			uniqueUsername = false;
		}
	}
	return uniqueUsername;
}

router.get('/', async (req, res) => {
	if (
		req.session.user &&
		req.session.user.username &&
		req.session.user.password
	) {
		if (
			authenticatedUser(req.session.user.username, req.session.user.password)
		) {
			res.status(200).render('user/profile', {
				user: req.session.user,
				// js: 'user/loggedin',
				notLoggedIn: false
			});
		}
	} else {
		res.status(200).render('user/signup', {notLoggedIn: true});
	}
});

router.post('/', async (req, res) => {
	if (req.session.user) {
		if (
			authenticatedUser(req.session.user.username, req.session.user.password)
		) {
			res.status(200).render('user/profile', {
				user: req.session.user,
				// js: 'user/loggedin',
				notLoggedIn: false
			});
		}
	} else {
		const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

		if (await uniqueUsername(req.body.username)) {
			const user = await userData.create(
				req.body.username,
				req.body.firstName,
				req.body.lastName,
				hashedPassword,
				req.body.age,
				req.body.country,
			);
			req.session.user = {
				id: user._id,
				username: user.username,
				firstName: user.firstName,
				lastName: user.lastName,
				password: hashedPassword,
				age: user.age,
				country: user.country,
			};
			res.status(200).render('user/profile', {
				user: user,
				// js: 'user/loggedin',
				notLoggedIn: false
			});
		} else {
			res.status(403).render('user/signup', {notLoggedIn: true});
		}
	}
});

module.exports = router;
