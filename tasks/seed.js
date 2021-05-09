const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const fetchData = require('../fetchData/fetchData');
const fightersCollection = data.fighters;
const fightCardsCollection = data.fightCards;
const boutOddsCollection = data.boutOdds;
const messagesCollection = data.messages;
const usersCollection = data.users;

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

	let luke = await usersCollection.create(
		'lmcevoy',
		'luke',
		'mcevoy',
		'passwordl',
		21,
		'US',
	);
	let jay = await usersCollection.create(
		'jmoney',
		'Jay',
		'Money',
		'passwordj',
		31,
		'EE',
	);
	let hold = await usersCollection.create(
		'holdma',
		'Hold',
		'Ma',
		'passwordm',
		31,
		'EE',
	);
	let elon = await usersCollection.create(
		'emusk',
		'Elon',
		'Musk',
		'passworde',
		53,
		'EE',
	);
	let fred = await usersCollection.create(
		'frezno',
		'Fredrick',
		'Buns',
		'passwordf',
		65,
		'FJ',
	);

	let timestamp = new Date();
	let lukemsg1 = await messagesCollection.createMessage(
		boutIds[0].toString(),
		'Brunson will win this fight easily',
		timestamp,
		luke._id,
		luke.username,
	);
	await usersCollection.updateRecentMessages(luke._id, lukemsg1);
	timestamp.setHours(timestamp.getHours() + 1);
	let jaymsg1 = await messagesCollection.createMessage(
		boutIds[0].toString(),
		'Nah Holland all the way',
		timestamp,
		jay._id,
		jay.username,
	);
	await usersCollection.updateRecentMessages(jay._id, jaymsg1);
	timestamp.setHours(timestamp.getHours() + 3);
	let fredmsg1 = await messagesCollection.createMessage(
		boutIds[0].toString(),
		'F*** Holland',
		timestamp,
		fred._id,
		fred.username,
	);
	await usersCollection.updateRecentMessages(fred._id, fredmsg1);

	await db.serverConfig.close();
}

main();
