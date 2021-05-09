const express = require("express");
const router = express.Router();
const data = require("../data");
let { ObjectId } = require("mongodb");
const { getFightCardByName } = require("../data/fightCards");
const { updatePickEmsFuture } = require("../data/users");
const userData = data.users;

router.get("/globalUserStats", async (res, req) => {
  const users = await userData.getAllUsers();
  const worldDict = {};
  for (let user of users) {
    if (user.country === null) break;
    if (user.country in worldDict) {
      user.country += 1;
    } else {
      worldDict[`${user.country}`] = 1;
    }
  }
  console.log(worldDict);
  return worldDict;
});
router.post("/updatePickem", async (req, res) => {
  if (!req.session.user.id) throw "no user signed in";
  const userID = req.session.user.id;
  let parsedId;
  try {
    parsedId = ObjectId(userID);
  } catch (e) {
    throw e.message;
  }

  const title = req.body.title;
  const fighter = req.body.name;
  let fightCardId = await getFightCardByName(title);
  await updatePickEmsFuture(parsedId, [fighter, null], fightCardId);
  //[fightcardid: [[fighter1, Null]]];
});

module.exports = router;
