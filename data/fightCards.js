const mongoCollections = require("../config/mongoCollections");
const fightCards = mongoCollections.fightCards;
const boutOdds = require("./boutOdds");
function checkStrings(s) {
  if (!s || typeof s !== "string" || s.trim() === "") return false;
  return true;
}
function checkDate(dt) {
  //Note: Code gotten from user Elian Ebbing on stackoverflow https://stackoverflow.com/questions/6177975/how-to-validate-date-with-format-mm-dd-yyyy-in-javascript
  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dt)) return false;
  let parts = dt.split("/");
  let day = parseInt(parts[1], 10);
  let month = parseInt(parts[0], 10);
  let year = parseInt(parts[2], 10);
  if (month == 0 || month > 12) return false;
  let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
    monthLength[1] = 29;
  return day > 0 && day <= monthLength[month - 1];
}
function validateFightCard(fightCard) {
  // {
  //     "_id": "507f1f77bcf86cd799439011",
  //     "allBoutOdds": [{}, {}],
  //     "location": "Las Vegas, NV",
  //     "date": "10/15/2021",
  //     "title": "UFC 260"
  // }
  if (!checkStrings(fightCard.location)) {
    throw `Fight Card Location must be a non empty string, it is currenty: ${fightCard.location}`;
  }
  if (!checkDate(fightCard.date)) {
    throw `Date must be formatted in mm/dd/yyyy, it is currently: ${fightCard.date}`;
  }
  if (!checkStrings(fightCard.title)) {
    throw `Fight Card Title must be a non empty string, it is currenty: ${fightCard.title}`;
  }
  for (let i = 0; i < fightCard.allBoutOdds.length; i++) {
    //Loop through allBoutOdds and confirming all the boutOdds are formatted correctly
    boutOdds.validateBoutObject(fightCard.allBoutOdds[i]); //Method in ./boutOdds.js
  }
}
let exportedMethods = {
  async getFightCardById(id) {
    //Assumes id in object form
    const fightCardsCollection = await fightCards();
    const fightCard = await fightCardsCollection.findOne({ _id: id });
    if (!fightCard) throw "Fight card not found";
    return fightCard;
  },
  async addFightCard(newFightCardObject) {
    validateFightCard(newFightCardObject);
    const fightCardsCollection = await fightCards();
    const newInsertInformation = await fightCardsCollection.insertOne(
      newFightCardObject
    );
    if (newInsertInformation.insertedCount === 0) throw "Insert failed!";
    return await this.getFightCardById(newInsertInformation.insertedId);
  },
};

module.exports = exportedMethods;
