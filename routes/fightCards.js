const express = require("express");
const router = express.Router();
const data = require("../data");
const fightCardsData = data.fightCards;
function checkIds(id) {
  if (!id) throw "You must provide an id to search for";
  if (typeof id !== "string" || id === "" || id.trim() === "") {
    throw "Id must be a non empty string";
  }
}
function myDBfunction(id) {
  //function used to convert string id to obj id
  checkIds(id);
  let { ObjectId } = require("mongodb");
  let newObjId = ObjectId(); //creates a new object ID
  let x = newObjId.toString(); // converts the Object ID to string

  //Now we check if it's a valid ObjectId so we attempt to convert a value to a valid object ID,
  //if it fails, it will throw an error (you do not have to throw the error, it does it automatically and the catch where you call the function will catch the error just as it catches your other errors).
  let parsedId = ObjectId(id);
  return parsedId;
}
router.get("/:id", async (req, res) => {
  try {
    const card = await fightCardsData.getFightCardById(
      myDBfunction(req.params.id)
    );
    res.json(card);
  } catch (e) {
    res.status(404).json({ error: "Card not found" });
  }
});
module.exports = router;
