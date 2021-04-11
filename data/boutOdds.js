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
  },
  //   const bookCollection = await books();
  //     objId = myDBfunction(id);
  //     //gets the book with the review
  //     let localBook = await bookCollection
  //       .find({ "reviews._id": objId })
  //       .toArray();
  //     for (let i = 0; i < localBook[0].reviews.length; i++) {
  //       if (localBook[0].reviews[i]._id.toString() == objId.toString()) {
  //         return localBook[0].reviews[i];
  //       }
  //     }
  //     throw "The review was not found, and I really don't know why. You should never get this message";
  async addBout(newBoutObject) {
    const boutOddsCollection = await boutOdds();
    const newInsertInformation = await boutOddsCollection.insertOne(
      newBoutObject
    );
    if (newInsertInformation.insertedCount === 0) throw "Insert failed!";
    return await this.getBoutById(newInsertInformation.insertedId);
  },
};

module.exports = exportedMethods;
