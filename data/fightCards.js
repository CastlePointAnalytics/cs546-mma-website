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
    getFightById: async (id) => {
        // will check if id is type string and non-empty
        checker.checkIsProperString(id, "Id", true);

        const fightCardCollection = await fightCards();

        let fight = await fightCardCollection.findOne({
            _id: mongo.ObjectId(id),
        });
    },
    //getUpcomingFights: async () => {},
};

module.exports = exportedMethods;
