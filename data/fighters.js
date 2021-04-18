const mongoCollections = require("../config/mongoCollections");
const fighters = mongoCollections.fighters;
const checker = require("../errorChecking");
const mongo = require("mongodb");

function validateFighterObject(fighterObject) {
    if (typeof fighterObject.firstName !== "string") throw "invalid first name";
    // lastName,
    // record,
    // age,
    // height,
    // weight,
    // reach,
    // location,
}

let exportedMethods = {
    /**
     * Gets all of the fighters from the collection and returns them with ids in string form
     * @returns all of the fighters in the collection
     */
    async getAllFighters() {
        const fighterCollection = await fighters();

        // gets all fighters in the collection
        let fighters = await fighterCollection.find();

        // // converts ids from Object Ids to strings
        // for (fighter in fighters) {
        //     fighter._id = fighter._id.toString();
        // }

        return fighters;
    },
    async getFighterById(id) {
        const fighterCollection = await fighters();

        const fighter = await fighterCollection.findOne({ _id: id });

        // check that the fighter exists, if not throw
        if (!fighter) throw "Fighter not found";

        return fighter;
    },
    async addFighter(newFighterObject) {
        validateFighterObject(newFighterObject);
        const fightersCollection = await fighters();

        const newInsertInformation = await fightersCollection.insertOne(
            newFighterObject
        );
        // verify that the insert was made properly
        if (newInsertInformation.insertedCount === 0) throw "Insert failed!";

        return await this.getFighterById(newInsertInformation.insertedId);
    },
};

module.exports = exportedMethods;
