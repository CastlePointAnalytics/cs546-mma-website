const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');
const fightCardsData = data.fightCards;
const boutOddsData = data.boutOdds;
const { ObjectId } = require('mongodb');

function checkIds(id) {
	if (!id) throw 'You must provide an id to search for';
	if (typeof id !== 'string' || id === '' || id.trim() === '') {
		throw 'Id must be a non empty string';
	}
}
function validateFightCard(fightCard) {
	// {
	//     "_id": "507f1f77bcf86cd799439011",
	//     "allBoutOdds": [],
	//     "location": "Las Vegas, NV",
	//     "date": "10/15/2021",
	//     "title": "UFC 260"
	// }
	if (!checkStrings(fightCard.location)) {
		throw `Fight Card Location must be a non empty string, it is currenty: ${fightCard.location}`;
	}
	if (!checkDate(fightCard.date)) {
		throw `Date must be formatted in mm/dd/yyyy, it is currently: ${fightCard.date}`;
	}
	if (!checkStrings(fightCard.title)) {
		throw `Fight Card Title must be a non empty string, it is currenty: ${fightCard.title}`;
	}
	if (!fightCard.allBoutOdds.length == 0) {
		throw `Bout odds must be empty to start when creating a fightCard`;
	}
}
function myDBfunction(id) {
	//function used to convert string id to obj id
	checkIds(id);
	let { ObjectId } = require('mongodb');
	// let newObjId = ObjectId(); //creates a new object ID
	// let x = newObjId.toString(); // converts the Object ID to string

	//Now we check if it's a valid ObjectId so we attempt to convert a value to a valid object ID,
	//if it fails, it will throw an error (you do not have to throw the error, it does it automatically and the catch where you call the function will catch the error just as it catches your other errors).
	let parsedId = ObjectId(id);
	return parsedId;
}

router.get('/:id', async (req, res) => {
	try {
		const card = await fightCardsData.getFightCardById(
			myDBfunction(req.params.id),
		);
		console.log('card -> ', card);
		console.log('allBoutOdds -> ', card.allBoutOdds);
		let userBool;
		if (req.session.user) {
			userBool = true;
		} else {
			userBool = false;
		}
		res.render('landings/fightCard', {
			title: card.title,
			allBouts: card.allBoutOdds,
			css: 'fightCard.css',
			loggedIn: userBool,
		});
	} catch (e) {
		res.status(404).json({ error: e.message });
	}
});

router.post('/', async (req, res) => {
	try {
		// gets the upcomingFightCards
		const upcomingFightCards = await fightCardsData.getUpcomingFightCards();
		let userMatchUp = {};
		let matchUpOdds = {};
		// gets the inputs from the landing page form
		matchUpOdds.fighter1 = ObjectId(req.body.fighter1);
		matchUpOdds.fighter2 = ObjectId(req.body.fighter2);
		// if there are no upcoming fight cards in the db set default values
		if (upcomingFightCards.length === 0) {
			userMatchUp.location = 'Las Vegas, NV';
			// get today's date formatted like: 'MM/DD/YYYY'
			let today = new Date();
			let month = String(today.getMonth() + 1).padStart(2, '0');
			let day = String(today.getDate()).padStart(2, '0');
			let year = today.getFullYear();
			userMatchUp.date = `${month}/${day}/${year}`;
			userMatchUp.title = 'UFC 9000';
		} else {
			userMatchUp.location = upcomingFightCards[0].location;
			userMatchUp.date = upcomingFightCards[0].date;
			userMatchUp.title = upcomingFightCards[0].title;
		}
		userMatchUp.allBoutOdds = [];
		userMatchUp.notActualFight = true;
		// adds the new fightCard to the list of fightCards
		userMatchUp = await fightCardsData.addFightCard(userMatchUp);
		matchUpOdds.fightDate = userMatchUp.date;

		// TODO generate user matchUp probabilities
		matchUpOdds.cpaProb = { fighter1: 'N/A', fighter2: 'N/A' };
		matchUpOdds.vegasProb = { fighter1: 'N/A', fighter2: 'N/A' };
		matchUpOdds.vegasMoneyLine = { fighter1: 'N/A', fighter2: 'N/A' };
		matchUpOdds.expectedValue = { fighter1: 'N/A', fighter2: 'N/A' };

		// boutOdds created for user made match up
		await boutOddsData.addBout(userMatchUp._id, matchUpOdds);

		res.redirect(`fightCards/${userMatchUp._id}`);
	} catch (e) {
		console.log(e);
	}
});

module.exports = router;
