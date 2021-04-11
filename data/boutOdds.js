const mongoCollections = require("../config/mongoCollections");
const fightCards = mongoCollections.fightCards;

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
//TODO: Convection of if string will be ID or objectID
let exportedMethods = {
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
