const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const errorChecking = require('../errorChecking');
const er = errorChecking.checker;

router.get('/', async (req, res) => {
	res.render('user/login');
	// // if authenticated user, redirect to profile page
	// if (req.session.user) {
	// 	res.redirect('/profile');
	// } else {
	// 	// render a view with a login form
	// 	res.render('user/login');
	// }
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
