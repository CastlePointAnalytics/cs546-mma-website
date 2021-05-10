const mongoCollections = require("../config/mongoCollections");
const fightCards = mongoCollections.fightCards;
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
function stringToDate(stringDate) {
    checkDate(stringDate);
    // split on the /
    stringDate = stringDate.split("/");
    // convert to a usable JS Date object
    return new Date(stringDate[2], stringDate[1] - 1, stringDate[2]);
}
/**
 * Sort the fightCards in order of date, furthest away to earliest
 */
function sortFightCardsByDate(fightCards) {
    if (fightCards.length <= 1) {
        return fightCards;
    }

    for (let i = 0; i < fightCards.length; i++) {
        let max = i;
        for (let j = i; j < fightCards.length; j++) {
            if (
                stringToDate(fightCards[max].date) <
                stringToDate(fightCards[j].date)
            )
                max = j;
        }
        // swap
        let temp = fightCards[max];
        fightCards[max] = fightCards[i];
        fightCards[i] = temp;
    }
    return fightCards;
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
let exportedMethods = {
    async getFightCardByName(title) {
        const fightCardsCollection = await fightCards();
        const fightCard = await fightCardsCollection.findOne({ title: title });
        return fightCard._id;
    },
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
        return await module.exports.getFightCardById(
            newInsertInformation.insertedId
        );
    },
    async getAllFightCards() {
        const fightCardsCollection = await fightCards();

        // get all fightcards in the collection
        const allFightCards = await fightCardsCollection.find();

        // returns the cursor to the fightCards as an array
        return allFightCards.toArray();
    },
    /**
     * Gets the most recent fight that has already taken place
     * @returns
     */
    async getMostRecentFightCard() {
        const today = new Date();
        const allFightCards = await module.exports.getAllFightCards();

        // sets the most recent fight card and date to the first item in the list of all fightCards
        let mostRecentFightCard = null;
        let mostRecentFightDate = null;
        for (let fightCard of allFightCards) {
            // convert current fightCard's date to a usable JS Date
            let fightDate = stringToDate(fightCard.date);

            if (fightCard.notActualFight) {
                continue;
            }

            // if current fightDate was before today AND after the current mostRecentFight
            if (
                fightDate < today &&
                (fightDate > mostRecentFightDate ||
                    mostRecentFightCard === null)
            ) {
                // swap the current fight to the most recent
                mostRecentFightCard = fightCard;
                mostRecentFightDate = fightDate;
            }
        }
        return mostRecentFightCard;
    },
    /**
     * Gets the 5 closest upcoming fightCards
     */
    async getUpcomingFightCards() {
        const today = new Date();
        const allFightCards = await module.exports.getAllFightCards();

        // list that will always be in descending order (fight that is furthest away will always be first element)
        let upcomingFights = [];
        for (let fightCard of allFightCards) {
            let fightDate = stringToDate(fightCard.date);
            // if fight has alreaady happened, then skip this iteration
            if (fightCard.notActualFight || fightDate < today) {
                continue;
            }
            // check if list is empty
            if (upcomingFights.length < 5) {
                upcomingFights.push(fightCard);
            }
            // if the furthest out upcomingFight is after the current fight, replace the furthest upcomingFight
            else if (stringToDate(upcomingFights[0].date) > fightDate) {
                upcomingFights[0] = fightCard;
            }
            // sort in descending order by date, in order to keep the most distant game as the first element
            upcomingFights = sortFightCardsByDate(upcomingFights);
        }
        // reverses the order to make them sorted in order from closest to furthest from today's date
        return upcomingFights.reverse();
    },
};

module.exports = exportedMethods;
