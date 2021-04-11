const mongoCollections = require('../config/mongoCollections');
const fullCardDistributions = mongoCollections.fullCardDistributions;

let exportedMethods = {
	async getFullCardDistributionById(id) {
		const fullCardDistributionsCollection = await fullCardDistributions();
		const fullCardDistribution = await fullCardDistributionsCollection.findOne({
			_id: id,
		});
		if (!fullCardDistribution) throw 'Full card distribution not found';
		return fullCardDistribution;
	},
	async addFullCardDistribution(newFullCardDistributionObject) {
		console.log('---> ', newFullCardDistributionObject);
		const fullCardDistributionsCollection = await fullCardDistributions();
		const newInsertInformation = await fullCardDistributionsCollection.insertOne(
			newFullCardDistributionObject,
		);
		if (newInsertInformation.insertedCount === 0) throw 'Insert failed';
		return await this.getFullCardDistributionById(
			newInsertInformation.insertedId,
		);
	},
};

module.exports = exportedMethods;
