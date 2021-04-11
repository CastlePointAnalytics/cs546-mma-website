const mongoCollections = require('../config/mongoCollections');
const fighters = mongoCollections.fighters;

function validateFighterObject(fighterObject) {
	if (typeof fighterObject.firstName !== 'string') throw 'invalid first name';
	// lastName,
	// record,
	// age,
	// height,
	// weight,
	// reach,
	// location,
}

let exportedMethods = {
	async getFighterById(id) {
		const fighterCollection = await fighters();
		const fighter = await fighterCollection.findOne({ _id: id });
		if (!fighter) throw 'Fighter not found';
		return fighter;
	},
	async addFighter(newFighterObject) {
		validateFighterObject(newFighterObject);
		const fightersCollection = await fighters();
		const newInsertInformation = await fightersCollection.insertOne(
			newFighterObject,
		);
		if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
		return await this.getFighterById(newInsertInformation.insertedId);
	},
};

module.exports = exportedMethods;
