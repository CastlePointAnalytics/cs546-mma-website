const express = require('express');
const router = express.Router();
const data = require('../data');
const fetchData = require('../fetchData/fetchData');
const xss = require('xss');

router.get('/', async (req, res) => {
	const prevFightCard = await fetchData.getPreviousFightCard();
	console.log(prevFightCard);
	res.render('previousFightCard/previousFightCard', {
		allBouts: prevFightCard,
		css: 'fightCard.css',
	});
});

module.exports = router;
