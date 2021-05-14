const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;
const fightCardData = data.fightCards;
const fightersData = data.fighters;
const bcrypt = require('bcryptjs');
const errorChecking = require('../errorChecking');
let { ObjectId } = require('mongodb');
const xss = require('xss');

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

async function repopulatePickEms(currUser){
	
	let pickEmFight = currUser.pickEmsFuture;
	let pickEmsArr = [];
	if (Object.keys(pickEmFight).length > 0) {
		
		for (let fight in currUser.pickEmsFuture) {
			let fightId;
			let pickEmsObject = {};
			let fighterArr = [];
			fightId = fight;

			let pickEmsArray = pickEmFight[fightId];

			let fightcard = await fightCardData.getFightCardById(ObjectId(fightId));

			pickEmsObject.title = fightcard.title;
			if(fightcard.notActualFight) pickEmsObject.title += " (Hypothetical)"

			for (let arr of pickEmsArray) {
				let fighter = await fightersData.getFighterById(ObjectId(arr[0]));
				fighterArr.push(fighter.firstName + ' ' + fighter.lastName);
			}
			pickEmsObject.fighters = fighterArr;
			pickEmsArr.push(pickEmsObject);
		}
		
	}
	currUser.pickEmsFuture = pickEmsArr;
	return currUser;
}

router.get('/', async (req, res) => {
	if (
		req.session.user &&
		req.session.user.username
	) {
		let id;
		try {
			id = ObjectId(req.session.user.id);
		} catch (e) {
			console.log(e.message);
			return;
		}

		let currUser = await userData.get(id);
		
		currUser = await repopulatePickEms(currUser);

		res.status(200).render('user/profile', {
			// user: req.session.user,
			user: currUser,
			// js: 'user/loggedin.js',
			notLoggedIn: false,
		});
	} else {
		res.render('user/login', { notLoggedIn: true });
	}
});

router.post('/', async (req, res) => {
	if (await authenticatedUser(xss(req.body.username), xss(req.body.password))) {
		let currUser;
		for (let user of await userData.getAllUsers()) {
			if (
				user.username.toLowerCase() == xss(req.body.username).toLowerCase() &&
				(await bcrypt.compare(xss(req.body.password), user.password))
			) {
				currUser = user;
			}
		}
		//const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
		req.session.user = {
			id: currUser._id,
			username: currUser.username,
			firstName: currUser.firstName,
			lastName: currUser.lastName,
			//password: hashedPassword,
			// age: currUser.age,
			// country: currUser.country,
			// recentMessages: currUser.recentMessages,
			// pickEmsFuture: currUser.pickEmsFuture,
			// pickEmsPast: currUser.pickEmsPast
		};

		currUser = await repopulatePickEms(currUser);

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
