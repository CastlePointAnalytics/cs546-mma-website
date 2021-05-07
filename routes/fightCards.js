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
        res.render("landings/fightCard", {
            title: card.title,
            allBouts: card.allBoutOdds,
            css: "fightCard.css",
        });
    } catch (e) {
        res.status(404).json({ error: e.message });
    }
});

router.post("/", async (req, res) => {
    try {
        const upcomingFightCards = await fightCardsData.getUpcomingFightCards();
        let userMatchUp = {};
        let matchUpOdds = {};
        matchUpOdds.fighter1 = fighter1;
        matchUpOdds.fighter2 = fighter2;
        // if there are no upcoming fight cards in the db set default values
        if (upcomingFightCards.length === 0) {
            userMatchUp.location = "Las Vegas, NV";
            // get today's date formatted like: 'MM/DD/YYYY'
            let today = new Date();
            let month = String(today.getMonth() + 1).padStart(2, "0");
            let day = String(today.getDate()).padStart(2, "0");
            let year = today.getFullYear();
            userMatchUp.date = `${month}/${day}/${year}`;
            userMatchUp.title = "UFC 9000";
        } else {
            userMatchUp.location = upcomingFightCards[0].location;
            userMatchUp.date = upcomingFightCards[0].date;
            userMatchUp.title = upcomingFightCards[0].title;
        }
        userMatchUp = await fightCardsData.addFightCard(userMatchUp);

        matchUpOdds.fightDate = userMatchUp.date;

        // TODO generate user matchUp probabilities

        // boutOdds created for user made match up
        boutOddsData.addBout(userMatchUp._id, matchUpOdds);

        res.redirect(`/${userMatchUp._id}`);
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
