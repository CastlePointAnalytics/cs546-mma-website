const { fightCards } = require("../config/mongoCollections");
const dbConnection = require("../config/mongoConnection");
const data = require("../data");
const fightersCollection = data.fighters;
const fightCardsCollection = data.fightCards;
const boutOdds = data.boutOdds;

async function main() {
  const db = await dbConnection();
  await db.dropDatabase();

  //Create 2 fighters
  let brunson = {
    firstName: "Derek",
    lastName: "Brunson",
    record: { wins: 21, losses: 7, draws: 0 },
    age: 37,
    height: 76,
    weight: 186,
    reach: 77,
    location: "USA",
  };
  let holland = {
    firstName: "Kevin",
    lastName: "Holland",
    record: { wins: 21, losses: 5, draws: 1 },
    age: 28,
    height: 76,
    weight: 183,
    reach: 81,
    location: "USA",
  };
  let bruns = await fightersCollection.addFighter(brunson);
  let holls = await fightersCollection.addFighter(holland);
  let brunsID = bruns._id;
  let hollsID = holls._id;
  //Create a fight card
  let card = {
    allBoutOdds: [],
    location: "Las Vegas, NV",
    date: "10/15/2021",
    title: "UFC 260",
  };
  let myCard = await fightCardsCollection.addFightCard(card);
  //Add the bout to the card
  let odds = {
    fighter1: brunsID,
    fighter2: hollsID,
    cpaProb: { fighter1: 44.4, fighter2: 55.6 },
    vegasProb: { fighter1: 39.1, fighter2: 60.9 },
    vegasMoneyLine: { fighter1: 145, fighter2: -175 },
    expectedValue: { fighter1: 1.06, fighter2: 0.87 },
    fightDate: "3/20/2021",
  };
  await boutOdds.addBout(myCard._id, odds);
  await db.serverConfig.close();
}

main();
