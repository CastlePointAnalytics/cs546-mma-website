const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
// const errorChecking = require('../errorChecking');
// const er = errorChecking.checker;
const bcrypt = require('bcrypt');
const saltRounds = 2;

module.exports = {
	async getAllUsers() {
		const userCollection = await users();
		return await userCollection.find({}).toArray();
	},
	async getUserById(id) {
		// try {
		// 	er.isValidString(id, 'id');
		// } catch (e) {
		// 	throw e;
		// }
		const userCollection = await users();
		const user = await userCollection.findOne({ _id: id });
		if (!user) throw 'No user with that ID';
		return user;
	},
	async create(username, firstName, lastName, password, age, country) {
		const userCollection = await users();
		//error checking...
		// try {
		// 	er.isValidString(username, 'username');
		// 	er.isValidString(firstName, 'firstName');
		// 	er.isValidString(lastName, 'lastName');
		// 	er.isValidAge(age, 'age');
		// 	er.isValidString(country, 'country');
		// } catch (e) {
		// 	throw e;
		// }
		//done with error checking

		const hashedPassword = await bcrypt.hash(password, saltRounds);

		let newUser = {
			username: username,
			firstName: firstName,
			lastName: lastName,
			password: hashedPassword,
			age: age,
			country: country,
		};
		const insertInfo = await userCollection.insertOne(newUser);
		if (insertInfo.insertedCount === 0) throw 'Could not add user.';
		return await this.getUserById(insertInfo.insertedId);
	},
};
