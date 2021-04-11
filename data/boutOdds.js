const mongoCollections = require("../config/mongoCollections");
const boutOdds = mongoCollections.boutOdds;

let exportedMethods = {
    async getBoutById(id) {
        const boutOddsCollection = await boutOdds();
        const boutOdd = await boutOddsCollection.findOne({ _id: id });
        if (!boutOdd) throw "Fighter not found";
        return boutOdd;
    },
    async addBout(newBoutObject) {
        const boutOddsCollection = await boutOdds();
        const newInsertInformation = await boutOddsCollection.insertOne(
            newBoutObject
        );
        if (newInsertInformation.insertedCount === 0) throw "Insert failed!";
        return await this.getBoutById(newInsertInformation.insertedId);
    },
};

module.exports = exportedMethods;
