const express = require('express');
const fetchData = require('../fetchData/fetchData');
const router = express.Router();
const path = require('path');

router.get('/', async (req, res) => {
	let notLogged = true;
	if(req.session.user){
		notLogged = false;
	}
	res.render('bettingStrategy/bettingStrategy', {
		css: 'bettingStrategy.css',
		js: 'bettingStrategy/bettingStrategyForm.js',
		notLoggedIn: notLogged
	});
});

router.get('/apiData', async (req, res) => {
	const fullCardDistJSONData = await fetchData.getFullCardDistributions();
	res.json(fullCardDistJSONData);
});

module.exports = router;
