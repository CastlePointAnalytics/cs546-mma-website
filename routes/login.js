const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const bcrypt = require('bcryptjs');
const saltRounds = 2;
const xss = require('xss');
const errorChecking = require('../errorChecking');

function validateFormData(inputUsername, inputPassword) {
	try {
		errorChecking.isValidString(inputUsername, 'inputUsername');
		errorChecking.isValidString(inputPassword, 'inputPassword');
	} catch (e) {
		console.log(e);
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
		xss(req.session.user) &&
		xss(req.session.user.username) &&
		xss(req.session.user.password)
	) {
		if (
			authenticatedUser(req.session.user.username, req.session.user.password)
		) {
			res.status(200).render('user/profile', {
				user: req.session.user,
			});
		} else {
			res.render('user/login', { loginError: true });
		}
	} else {
		res.render('user/login');
	}
});

router.post('/', async (req, res) => {
	if (await authenticatedUser(xss(req.body.username), xss(req.body.password))) {
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
		});
	} else {
		res.status(401).render('user/login', { loginError: true });
	}
});

module.exports = router;
