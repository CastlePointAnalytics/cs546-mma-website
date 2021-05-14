const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const fetchData = require('../fetchData/fetchData');
const fightersCollection = data.fighters;
const fightCardsCollection = data.fightCards;
const boutOddsCollection = data.boutOdds;
const messagesCollection = data.messages;
const usersCollection = data.users;
const countries = data.countries.COUNTRIES;

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
		countries.US,
	);
	let jay = await usersCollection.create(
		'jmoney',
		'Jay',
		'Money',
		'passwordj',
		31,
		countries.EE,
	);
	let hold = await usersCollection.create(
		'holdma',
		'Hold',
		'Ma',
		'passwordm',
		31,
		countries.EE,
	);
	let elon = await usersCollection.create(
		'emusk',
		'Elon',
		'Musk',
		'passworde',
		53,
		countries.EE,
	);
	let fred = await usersCollection.create(
		'frezno',
		'Fredrick',
		'Buns',
		'passwordf',
		65,
		countries.FJ,
	);
	let elias = await usersCollection.create(
		'one',
		'Elias',
		'Frieling',
		'1',
		65,
		countries.FJ,
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

	for(let bout in boutIds){
		if(bout === 0){
			continue;
		}
		let mesg = await messagesCollection.createMessage(
			boutIds[bout].toString(),
			"Seeded Message",
			timestamp,
			elias._id,
			elias.username);
		await usersCollection.updateRecentMessages(elias._id, mesg);
	}
	await db.serverConfig.close();
	console.log("Database seeded homie!");
}

main();
