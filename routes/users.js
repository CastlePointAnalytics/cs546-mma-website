const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const errorChecking = require('../errorChecking');
const er = errorChecking.checker;
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
	for (let user of usersData) {
		if (
			user.username.toLowerCase() == inputUsername &&
			(await bcrypt.compare(inputPassword, user.hashedPassword))
		) {
			presentUser = true;
		}
	}
	return presentUser;
}

router.get('/', async (req, res) => {
	// if authenticated user, redirect to profile page
	if (req.session.user) {
		res.redirect('/profile');
	} else {
		// render a view with a login form
		res.render('user/login');
	}
});

router.post('/login', async (req, res) => {
	// if successful username + password
	if (await authenticatedUser(req.body.username, req.body.password)) {
		// set AuthCookie
		let currUser;
		for (let user of await userData.getAllUsers()) {
			if (
				user.username.toLowerCase() == req.body.username &&
				(await bcrypt.compare(req.body.password, user.hashedPassword))
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
		res.redirect('user/profile');
	} else {
		// if not successful
		res.status(401).render('user/login');
		// error message with HTTP 401
	}
});

router.get('/:id', async (req, res) => {
	try {
		const user = await userData.get(req.params.id);
		res.json(user);
	} catch (e) {
		res.status(404).json({ message: 'Error: not found!' });
	}
});

router.post('/', async (req, res) => {
	const userAdd = req.body;
	try {
		er.isValidString(userAdd.username, 'username');
		er.isValidString(userAdd.firstName, 'firstName');
		er.isValidString(userAdd.lastName, 'lastName');
		er.isValidArray(userAdd.age, 'age');
		er.isValidString(userAdd.country, 'country');
	} catch (e) {
		res.status(400).json({ error: e });
		return;
	}
	try {
		const { username, firstName, lastName, age, country } = userAdd;
		const user = await userData.create(
			username,
			firstName,
			lastName,
			age,
			country,
		);
		res.json(user);
	} catch (e) {
		res.status(404).json({ message: 'Error: not found!' });
	}
});

module.exports = router;
