const { boutOdds } = require('../config/mongoCollections');
const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const fetchData = require('../fetchData/fetchData');
const fightersCollection = data.fighters;
const fightCardsCollection = data.fightCards;
const fullCardDistributionsCollection = data.fullCardDistributions;
const boutOddsCollection = data.boutOdds;
const boutOddsCollection = require('../data/boutOdds');
const messagesCollection = data.messages;
const usersCollection = data.users;

async function main() {
	const db = await dbConnection();
	await db.dropDatabase();

	const fightersJSONData = await fetchData.getFighters();
	// [(id1, id2), ...]
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

	let d = new Date();
	d.setHours(d.getHours() + 1);

	let message1;
	let message2;
	let bout1Messages;
	let message3;
	try{
		message1 = await messagesCollection.createMessage('1','Test Message', new Date(), '4');
	}catch(e){
		console.log(e);
	}
	try{
		message2 = await messagesCollection.createMessage('1', 'Message #2', d, '7', '4');
	
	}catch(e){
		console.log(e);
	}
	try{
		bout1Messages = await messagesCollection.getAllMessagesFromBout('1');
		console.log(bout1Messages);
	}catch(e){
		console.log(e);
	}
	try{
		message3 = await messagesCollection.updateMessage(message1._id.toString(), 'new message', '4', d);
	}catch(e){
		console.log(e);
	}
	await db.serverConfig.close();
}

main();
