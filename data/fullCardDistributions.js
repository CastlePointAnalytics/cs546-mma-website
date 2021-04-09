const mongoCollections = require("../config/mongoCollections");
const fullCardDistributions = mongoCollections.fullCardDistributions;
const mongo = require("mongodb");

let exportedMethods = {
    getAllFights: async () => {
        const fullCardDistCollection = await fullCardDistributions();

        let data = await fullCardDistCollection.find();
        for (card in data) card._id = card._id.toString();

        return data;
    },
};

module.exports = exportedMethods;
