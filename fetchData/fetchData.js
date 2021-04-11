const axios = require('axios');

const knockoutDataURL =
	'https://raw.githubusercontent.com/CastlePointAnalytics/cs546-data-endpoint/master/546_data/knockout_3_20';

async function getBoutOdds() {
	let { data } = await axios.get(knockoutDataURL + '/boutOdd.json');
	return data;
}

async function getFightCards() {
	let { data } = await axios.get(knockoutDataURL + '/fightCard.json');
	return data;
}

async function getFighters() {
	let { data } = await axios.get(knockoutDataURL + '/fighter.json');
	return data;
}

async function getFullCardDistributions() {
	let { data } = await axios.get(
		knockoutDataURL + '/fullCardDistribution.json',
	);
	return data;
}

module.exports = {
	getBoutOdds,
	getFighters,
	getFightCards,
	getFullCardDistributions,
};
