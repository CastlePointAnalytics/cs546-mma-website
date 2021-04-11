const mongoCollections = require("../config/mongoCollections");
const fightCards = mongoCollections.fightCards;
const fighters = require("./fighters");
function checkIds(id) {
  if (!id) throw "You must provide an id to search for";
  if (typeof id !== "string" || id === "" || id.trim() === "") {
    throw "Id must be a non empty string";
  }
}
function getIdFromString(id) {
  checkIds(id);
  let { ObjectId } = require("mongodb");
  let newObjId = ObjectId(); //creates a new object ID
  let x = newObjId.toString(); // converts the Object ID to string

  //Now we check if it's a valid ObjectId so we attempt to convert a value to a valid object ID,
  //if it fails, it will throw an error (you do not have to throw the error, it does it automatically and the catch where you call the function will catch the error just as it catches your other errors).
  let parsedId = ObjectId(id);
  return parsedId;
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
//TODO: Convection of if string will be ID or objectID
let exportedMethods = {
  async validateBoutObject(boutObject) {
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
    //Check that both fighters are in the db, will throw if they are not
    await fighters.getFighterById(boutObject.fighter1._id);
    await fighters.getFighterById(boutObject.fighter2._id);
    if (!checkDate(boutObject.fightDate)) {
      throw `fightDate must be in mm/dd/yyyy format, it is currently: ${boutObject.fightDate}`;
    }
    if (
      Object.keys(boutObject.cpaProb).length === 0 &&
      boutObject.cpaProb.constructor === Object
    ) {
      //Check odds objects to make sure they aren't empty
      throw "cpaProb is empty";
    }
    if (
      Object.keys(boutObject.vegasProb).length === 0 &&
      boutObject.vegasProb.constructor === Object
    ) {
      throw "vegasProb is empty";
    }
    if (
      Object.keys(boutObject.vegasMoneyLine).length === 0 &&
      boutObject.vegasMoneyLine.constructor === Object
    ) {
      throw "vegasMoneyLine is empty";
    }
    if (
      Object.keys(boutObject.expectedValue).length === 0 &&
      boutObject.expectedValue.constructor === Object
    ) {
      throw "expectedValue is empty";
    }
    //Check odds objects to make sure they are numbers
    if (typeof boutObject.cpaProb.fighter1 !== "number") {
      throw "cpaProb figher1 value is NaN";
    }
    if (typeof boutObject.cpaProb.fighter2 !== "number") {
      throw "cpaProb figher2 value is NaN";
    }
    if (typeof boutObject.vegasProb.fighter1 !== "number") {
      throw "vegasProb figher1 value is NaN";
    }
    if (typeof boutObject.vegasProb.fighter2 !== "number") {
      throw "vegasProb figher2 value is NaN";
    }
    if (typeof boutObject.vegasMoneyLine.fighter1 !== "number") {
      throw "vegasMoneyLine figher1 value is NaN";
    }
    if (typeof boutObject.vegasMoneyLine.fighter2 !== "number") {
      throw "vegasMoneyLine figher2 value is NaN";
    }
    if (typeof boutObject.expectedValue.fighter1 !== "number") {
      throw "expectedValue figher1 value is NaN";
    }
    if (typeof boutObject.expectedValue.fighter2 !== "number") {
      throw "expectedValue figher2 value is NaN";
    }
  },
  async getBoutById(id) {
    //Gets an individual bout from it's ID (same code from lab6 pretty much)
    const fightCardsCollection = await fightCards();
    objId = getIdFromString(id);
    let localFightCard = await fightCardsCollection
      .find({
        "allBoutOdds._id": objId,
      })
      .toArray();
    for (let i = 0; i < localFightCard[0].allBoutOdds.length; i++) {
      if (localFightCard[0].allBoutOdds[i]._id.toString() == objId.toString()) {
        return localFightCard[0].allBoutOdds[i];
      }
    }
    throw `boutOdd with id: ${id} was not found`;
  },
  //TODO: Convection of if string will be ID or objectID
  async addBout(fightCardID, newBoutObject) {
    await module.exports.validateBoutObject(newBoutObject);
    const fightCardsCollection = await fightCards();
    let myFightCard = await fightCards.getFightCardById(fightCardID); //Just to make sure theres no errors, try getting it first
    let { ObjectId } = require("mongodb");
    let newObjId = ObjectId(); //creates a new object ID
    newBoutObject[_id] = newObjId;
    try {
      await fightCardsCollection.updateOne(
        { _id: fightCardID },
        { $addToSet: { allBoutOdds: newBoutObject } }
      );
    } catch (e) {
      console.error(e);
    }
    myFightCard = await fightCards.getFightCardById(fightCardID); //This assume Object representation
    return myFightCard;
  },
};

module.exports = exportedMethods;
