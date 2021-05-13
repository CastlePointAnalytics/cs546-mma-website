const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const fightCardData = data.fightCards;
const fightersData = data.fighters;
const bcrypt = require('bcryptjs');
const saltRounds = 2;
const xss = require('xss');
const errorChecking = require('../errorChecking');
let { ObjectId } = require('mongodb');

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
			let id;
			try {
				id = ObjectId(req.session.user.id);
			} catch (e) {
				console.log(e.message);
			}

			let currUser = await userData.get(id);
			console.log(currUser)
			res.status(200).render('user/profile', {
				// user: req.session.user,
				user: currUser,
				// js: 'user/loggedin.js',
				notLoggedIn: false,
			});
		} else {
			res.render('user/login', { loginError: true });
		}
	} else {
		res.render('user/login', { notLoggedIn: true });
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
			// firstName: currUser.firstName,
			// lastName: currUser.lastName,
			password: hashedPassword,
			// age: currUser.age,
			// country: currUser.country,
			// recentMessages: currUser.recentMessages,
			// pickEmsFuture: currUser.pickEmsFuture,
			// pickEmsPast: currUser.pickEmsPast
		};

		let fightId;
		let pickEmFight = currUser.pickEmsFuture;
		let newArr = [];
		let pickEmsObject = {};
		if (Object.keys(pickEmFight).length > 0) {
			for (let fight in currUser.pickEmsFuture) {
				fightId = fight;
			}
			let pickEmsArray = pickEmFight[fightId];

			let fightcard = await fightCardData.getFightCardById(ObjectId(fightId));

			pickEmsObject.title = fightcard.title;

			for (let arr of pickEmsArray) {
				let fighter = await fightersData.getFighterById(ObjectId(arr[0]));
				newArr.push(fighter.firstName + ' ' + fighter.lastName);
			}
		}

		pickEmsObject.fighters = newArr;
		currUser.pickEmsFuture = pickEmsObject;

		res.status(200).render('user/profile', {
			user: currUser,
			// js: 'user/loggedin',
			notLoggedIn: false,
		});
	} else {
		res
			.status(401)
			.render('user/login', { notLoggedIn: true, loginError: true });
	}
});

module.exports = router;
