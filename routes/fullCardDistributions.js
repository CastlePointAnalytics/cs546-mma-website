const express = require('express');
const router = express.Router();
const data = require('../data');
const fullCardDistData = data.fullCardDistributions;

router.get('/', async (req, res) => {
	try {
		const fullCardDistList = fullCardDistData.getAllFullCardDistributions();
		res.json(fullCardDistList);
	} catch (e) {
		[res.status(500).json({ error: e })];
	}
});

module.exports = router;
