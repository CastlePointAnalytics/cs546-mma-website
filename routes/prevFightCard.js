const express = require('express');
const router = express.Router();
const data = require('../data');
const fetchData = require('../fetchData/fetchData');
const xss = require('xss');

router.get('/', async (req, res) => {
	const prevFightCard = await fetchData.getPreviousFightCard();
	res.render('previousFightCard/previousFightCard', {
		allBouts: prevFightCard,
		css: 'fightCard.css',
		notLoggedIn: true,
	});
});

router.get('/apiData', async (req, res) => {
	const previousFightCardJSON = await fetchData.getPreviousFightCard();
	res.json(previousFightCardJSON);
});

module.exports = router;
