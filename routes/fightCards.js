const express = require("express");
const router = express.Router();
const data = require("../data");
const path = require("path");
const fightCardsData = data.fightCards;
const boutOddsData = data.boutOdds;
function checkIds(id) {
    if (!id) throw "You must provide an id to search for";
    if (typeof id !== "string" || id === "" || id.trim() === "") {
        throw "Id must be a non empty string";
    }
}
function validateFightCard(fightCard) {
    // {
    //     "_id": "507f1f77bcf86cd799439011",
    //     "allBoutOdds": [],
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
    if (!fightCard.allBoutOdds.length == 0) {
        throw `Bout odds must be empty to start when creating a fightCard`;
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
        let userBool;
        if (req.session.user) {
            userBool = true;
        } else {
            userBool = false;
        }
        res.render("landings/fightCard", {
            title: card.title,
            allBouts: card.allBoutOdds,
            css: "fightCard.css",
            loggedIn: userBool,
        });
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
});

module.exports = router;
