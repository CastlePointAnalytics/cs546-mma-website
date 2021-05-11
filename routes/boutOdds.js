const express = require("express");
const router = express.Router();
const data = require("../data");
const boutOdds = data.boutOdds;
const fightCards = data.fightCards;
const xss = require("xss");
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
  //Gets all boutOdds from a fightcard
  try {
    const fightCard = await fightCards.getFightCardById(
      myDBfunction(req.params.id)
    );
    res.json(fightCard.boutOdds);
  } catch (e) {
    res.status(404).json({ error: "Fightcard not found" });
  }
});
router.get("/boutOdds/:id", async (req, res) => {
  //Gets individual boutOdds
  try {
    const review = await boutOdds.getBoutOdds(myDBfunction(req.params.id));
    res.json(review);
  } catch (e) {
    res.status(404).json({ error: "Bout Odds not found" });
  }
});
router.post("/:id", async (req, res) => {
  //TODO: Error handling
  try {
    const fightCard = await fightCards.getFightCardById(
      //Making sure the fightCard exists
      myDBfunction(req.params.id)
    );
  } catch (e) {
    res.status(404).json({ error: "Fightcard not found" });
  }
  try {
    const newBoutOdds = xss(req.body);
    const newBoutOdds = await boutOdds.addBout(
      myDBfunction(req.params.id),
      newBoutOdds
    );
    res.json(newBoutOdds);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});
module.exports = router;
