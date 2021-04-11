const mongoCollections = require("../config/mongoCollections");
const fightCards = mongoCollections.fightCards;
const fighters = require("./fighters");
function validateFightCard(fightCard) {
  // {
  //     "_id": "507f1f77bcf86cd799439011",
  //     "allBoutOdds": [{}, {}],
  //     "location": "Las Vegas, NV",
  //     "date": "10/15/2021",
  //     "title": "UFC 260"
  // }
  // {
  //     "_id": "807f191a810c19729de860ae",
  //     "fighter1": {
  //         "_id": "507f1f77bcf86cd799439011",
  //         "firstName": "Jon",
  //         "lastName": "Jones",
  //         "record": { "wins": 26, "losses": 1, "draws": 0 },
  //         "age": 33,
  //         "height": 193,
  //         "weight": 93,
  //         "reach": 214.63,
  //         "location": "USA"
  //     },
  //     "fighter2": {
  //         "_id": "757f191a810c19729de860ae",
  //         "firstName": "Khabib",
  //         "lastName": "Nurmagomedov",
  //         "record": { "wins": 29, "losses": 0, "draws": 0 },
  //         "age": 32,
  //         "height": 177,
  //         "weight": 70,
  //         "reach": 70,
  //         "location": "Russia"
  //     },
  //     "cpaProb": { "fighter1": 43.2, "fighter2": 56.8 },
  //     "vegasProb": { "fighter1": 48.1, "fighter2": 51.9 },
  //     "vegasMoneyLine": { "fighter1": -570, "fighter2": 65 },
  //     "expectedValue": { "fighter1": 1.7, "fighter2": 6.2 },
  //     "fightDate": "4/10/2021"
  // }
  if (fightCard.allBoutOdds.length === 0) {
    //boutodds array is empty
    throw "allBoutOdds must not be empty";
  }
  for (let i = 0; i < fightCard.allBoutOdds.length; i++) {
    //Loop through allBoutOdds and confirm each fighter is in the fighters db
    //All error checking on this done in fighters.js
    getFighterById(fightCard.allBoutOdds[i].fighter1._id);
    getFighterById(fightCard.allBoutOdds[i].fighter2._id);
  }
}
let exportedMethods = {
  async getFightCardById(id) {
    const fightCardsCollection = await fightCards();
    const fightCard = await fightCardsCollection.findOne({ _id: id });
    if (!fightCard) throw "Fight card not found";
    return fightCard;
  },
  async addFightCard(newFightCardObject) {
    validateFighterObject(newFightCardObject);
    const fightCardsCollection = await fightCards();
    const newInsertInformation = await fightCardsCollection.insertOne(
      newFightCardObject
    );
    if (newInsertInformation.insertedCount === 0) throw "Insert failed!";
    return await this.getFightCardById(newInsertInformation.insertedId);
  },
};

module.exports = exportedMethods;
