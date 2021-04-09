const mongoCollections = require("../config/mongoCollections");
const fightCards = mongoCollections.fightCards;
const mongo = require("mongodb");
const checker = require("../errorChecking");

let exportedMethods = {
    /**
     * Gets and returns all of the fight cards with _id converted to a string
     * @returns all fight cards
     */
    getAllFights: async () => {
        const fightCardCollection = await fightCards();

        let data = await fightCardCollection.find();
        for (card in data) card._id = card._id.toString();

        return data;
    },
    /**
     * Finds the fightCard with the id provided
     * @param {string} id the object id of the fightCard we wish to find in string format
     * @returns the fightCard with the _id changed to its string representation
     */
    getFightById: async (id) => {
        // will check if id is type string and non-empty
        checker.checkIsProperString(id, "Id", true);

        const fightCardCollection = await fightCards();

        let fight = await fightCardCollection.findOne({
            _id: mongo.ObjectId(id),
        });

        // check if the fight with this id is found
        if (fight == null) throw `Fight Card with id ${id} not found.`;

        // set the _id into the string representation of itself
        fight._id = id;

        return fight;
    },
    getUpcomingFights: async () => {
        // determine how many of the upcoming fights should be displayed
        // get all fights and then find which are the closest
        // either sort the list of fightCards returned or iteratively choose the next closest fight
        // return final list in order of closeness (closest to furthest)
    },
};

module.exports = exportedMethods;
