const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const bcrypt = require('bcryptjs');
const saltRounds = 2;

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
				// js: 'user/loggedin.js',
			});
		}
	} else {
		res.render('user/login');
	}
});

router.post('/', async (req, res) => {
	if (await authenticatedUser(req.body.username, req.body.password)) {
		let currUser;
		for (let user of await userData.getAllUsers()) {
			if (
				user.username.toLowerCase() == req.body.username.toLowerCase() &&
				(await bcrypt.compare(req.body.password, user.password))
			) {
				currUser = user;
			}
		}
		const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
		req.session.user = {
			id: currUser._id,
			username: currUser.username,
			firstName: currUser.firstName,
			lastName: currUser.lastName,
			password: hashedPassword,
			age: currUser.age,
			country: currUser.country,
		};
		res.status(200).render('user/profile', {
			user: req.session.user,
			// js: 'user/loggedin'
		});
	} else {
		res.status(401).render('user/login');
	}
});

module.exports = router;
