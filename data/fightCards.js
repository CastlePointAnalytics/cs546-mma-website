const mongoCollections = require("../config/mongoCollections");
const fightCards = mongoCollections.fightCards;
const mongo = require("mongodb");
const checker = require("../errorChecking");

let exportedMethods = {
    async getFightCardById(id) {
        const fightCardsCollection = await fightCards();
        const fightCard = await fightCardsCollection.findOne({ _id: id });
        if (!fightCard) throw "Fight card not found";
        return fightCard;
    },
    async addFightCard(newFightCardObject) {
        // validateFighterObject(newBoutObject);
        const fightCardsCollection = await fightCards();
        const newInsertInformation = await fightCardsCollection.insertOne(
            newFightCardObject
        );
        if (newInsertInformation.insertedCount === 0) throw "Insert failed!";
        return await this.getFightCardById(newInsertInformation.insertedId);
    },
};

module.exports = exportedMethods;
