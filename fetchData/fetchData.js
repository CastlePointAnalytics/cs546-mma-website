const axios = require('axios');

const futureFightCard =
	'https://raw.githubusercontent.com/CastlePointAnalytics/cs546-data-endpoint/master/546_data/knockout_3_20';

const pastFightCardURL =
	'https://raw.githubusercontent.com/CastlePointAnalytics/cs546-data-endpoint/master/546_data/knockout_1_16';

async function getBoutOdds() {
	let { data } = await axios.get(futureFightCard + '/boutOdd.json');
	return data;
}

async function getFightCards() {
	let { data } = await axios.get(futureFightCard + '/fightCard.json');
	return data;
}

async function getFighters() {
	let { data } = await axios.get(futureFightCard + '/fighter.json');
	return data;
}

async function getFullCardDistributions() {
	let { data } = await axios.get(
		futureFightCard + '/fullCardDistribution.json',
	);
	return data;
}

async function getPreviousFightCard() {
	let { data } = await axios.get(pastFightCardURL + '/boutOdd.json');
	return data;
}

module.exports = {
	getPreviousFightCard,
	getBoutOdds,
	getFighters,
	getFightCards,
	getFullCardDistributions,
};
