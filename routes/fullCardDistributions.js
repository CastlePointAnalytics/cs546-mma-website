const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', async (req, res) => {
	res.sendFile(path.resolve('static/bettingStrategy.html'));
});

module.exports = router;
