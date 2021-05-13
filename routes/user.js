const express = require("express");
const router = express.Router();
const data = require("../data");
let { ObjectId } = require("mongodb");
const { getFightCardByName } = require("../data/fightCards");
const { updatePickEmsFuture } = require("../data/users");
const userData = data.users;
const xss = require("xss");

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
  return worldDict;
});
router.post("/updatePickem", async (req, res) => {
  if (typeof req.session.user == "undefined") {
    return;
  } else {
    const userID = req.session.user.id;
    let parsedId;
    try {
      parsedId = ObjectId(userID);
    } catch (e) {
      throw e.message;
    }
    const id = xss(req.body.id);
    const fighters = req.body.fighters;
    //Fighters is array of IDs in string format
    try {
      await updatePickEmsFuture(parsedId, fighters, id);
    } catch (e) {
      console.log(e);
    }
    //[fightcardid: [[fighter1, Null]]];
    return true;
  }
});

module.exports = router;
