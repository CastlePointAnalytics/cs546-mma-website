const express = require('express');
const fetchData = require('../fetchData/fetchData');
const router = express.Router();
const path = require('path');

router.get('/', async (req, res) => {
	res.render('bettingStrategy/bettingStrategy', {
		css: 'bettingStrategy.css',
	});
});

router.get('/apiData', async (req, res) => {
	const fullCardDistJSONData = await fetchData.getFullCardDistributions();
	res.json(fullCardDistJSONData);
});

module.exports = router;
