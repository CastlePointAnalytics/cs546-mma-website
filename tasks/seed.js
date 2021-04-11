const { boutOdds } = require('../config/mongoCollections');
const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const fetchData = require('../fetchData/fetchData');
const fightersCollection = data.fighters;
const fightCardsCollection = data.fightCards;
const fullCardDistributionsCollection = data.fullCardDistributions;
const boutOddsCollection = data.boutOdds;
const messagesCollection = data.messages;
const usersCollection = data.users;

async function main() {
	const db = await dbConnection();
	await db.dropDatabase();

	const fightersJSONData = await fetchData.getFighters();
	for (let i = 0; i < fightersJSONData.length; i++) {
		await fightersCollection.addFighter(fightersJSONData[i]);
	}

	const boutOddsJSONData = await fetchData.getBoutOdds();
	for (let i = 0; i < boutOddsJSONData.length; i++) {
		await boutOddsCollection.addBout(boutOddsJSONData[i]);
	}

	const fightCardsJSONData = await fetchData.getFightCards();
	for (let i = 0; i < fightCardsJSONData.length; i++) {
		await fightCardsCollection.addFightCard(fightCardsJSONData[i]);
	}

	const fullCardDistributionsJSONData = await fetchData.getFullCardDistributions();
	for (let i = 0; i < fullCardDistributionsJSONData.length; i++) {
		console.log(fullCardDistributionsJSONData[i]);
		await fullCardDistributionsCollection.addFullCardDistribution(
			fullCardDistributionsJSONData[i],
		);
	}

	await db.serverConfig.close();
}

main();
