const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const fetchData = require('../fetchData/fetchData');
const fightersCollection = data.fighters;
const fightCardsCollection = data.fightCards;
const boutOddsCollection = data.boutOdds;
// const boutOddsCollection = require('../data/boutOdds');
// const boutOdds = data.boutOdds;
 const messagesCollection = data.messages;
// const usersCollection = data.users;

async function main() {
	const db = await dbConnection();
	await db.dropDatabase();

	const fightersJSONData = await fetchData.getFighters();
	const fightCardsJSONData = await fetchData.getFightCards();
	const boutOddsJSONData = await fetchData.getBoutOdds();
	const currFightCard = await fightCardsCollection.addFightCard(
		fightCardsJSONData[0],
	);

	let boutIds = [];
	let boutIndex = 0;
	for (let i = 0; i < fightersJSONData.length; i += 2) {
		currBoutOdd = boutOddsJSONData[boutIndex++];
		const odds = {
			fighter1: (await fightersCollection.addFighter(fightersJSONData[i]))._id,
			fighter2: (await fightersCollection.addFighter(fightersJSONData[i + 1]))
				._id,
			cpaProb: currBoutOdd.cpaProb,
			vegasProb: currBoutOdd.vegasProb,
			vegasMoneyLine: currBoutOdd.vegasMoneyLine,
			expectedValue: currBoutOdd.expectedValue,
			fightDate: currFightCard.date,
		};
		let boutId = await boutOddsCollection.addBout(currFightCard._id, odds);
		boutIds.push(boutId);
	}

	let timestamp = new Date();
	await messagesCollection.createMessage(boutIds[0].toString(), "Brunson will win this fight easily", timestamp, "1", "test_user_name");
	timestamp.setHours(timestamp.getHours()+1);
	await messagesCollection.createMessage(boutIds[0].toString(), "Nah Holland all the way", timestamp, "2", "anotha_one");


	await db.serverConfig.close();
}

main();
