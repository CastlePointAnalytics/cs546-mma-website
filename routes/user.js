const express = require('express');
const router = express.Router();
const data = require('../data');
const userData = data.users;

router.get('/globalUserStats', async (res, req) => {
	const users = await userData.getAllUsers();
	const worldDict = {};
	for (let user of users) {
		if (user.country === null) break;
		if (user.country in worldDict) {
			user.country += 1;
		} else {
			worldDict[`${user.country}`] = 1;
		}
	}
	console.log(worldDict);
	return worldDict;
});

module.exports = router;
