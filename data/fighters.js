const mongoCollections = require("../config/mongoCollections");
const fighters = mongoCollections.fighters;
const checker = require("../errorChecking");
const mongo = require("mongodb");

let exportedMethods = {
    /**
     * Gets all of the fighters from the collection and returns them with ids in string form
     * @returns all of the fighters in the collection
     */
    getAllFighters: async () => {
        const fighterCollection = await fighters();

        // gets all fighters in the collection
        let fighters = await fighterCollection.find();

        // converts ids from Object Ids to strings
        for (fighter in fighters) {
            fighter._id = fighter._id.toString();
        }

        return fighters;
    },
    /**
     * Searches the collection for a fighter with the given id and returns if found,
     * otherwise throws error.
     * @returns fighter with the id <id>
     */
    getFighterById: async (id) => {
        // will check if id is type string and non-empty
        checker.checkIsProperString(id, "Fighter Id", true);

        const fighterCollection = await fighters();

        // gets the fighter with the specified id
        let fighter = await fighterCollection.findOne({
            _id: mongo.ObjectId(id),
        });

        // check that fighter was found
        if (fighter == null) {
            throw `Fighter with id ${id} not found.`;
        }

        fighter._id = id;

        return fighter;
    },
};

module.exports = exportedMethods;
