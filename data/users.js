const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcryptjs');
const saltRounds = 8;
const errorChecking = require('../errorChecking');
const countries = require("./countries");
let { ObjectId } = require('mongodb');

module.exports = {
	async getAllUsers() {
		const userCollection = await users();
		return await userCollection.find({}).toArray();
	},
	async get(id) {
		try {
			errorChecking.isValidID(id, 'id');
		} catch (e) {
			throw e;
		}
		const userCollection = await users();
		const user = await userCollection.findOne({ _id: id }); //?
		if (!user) throw 'No user with that id';
		return user;
	},
	async create(username, firstName, lastName, password, age, country) {
		const userCollection = await users();
		try {
			errorChecking.isValidString(username, 'username');
			errorChecking.isValidString(firstName, 'firstName');
			errorChecking.isValidString(lastName, 'lastName');
			errorChecking.isValidAge(age, 'age');
			errorChecking.isValidCountry(country, 'country'); // TODO
		} catch (e) {
			throw e;
		}
		const hashedPassword = await bcrypt.hash(password, saltRounds);

		let newUser = {
			username: username,
			firstName: firstName,
			lastName: lastName,
			password: hashedPassword,
			recentMessages: [],
			pickEmsFuture: {},
			pickEmsPast: [],
			age: age,
			country: country
		};
		console.log(newUser.country);
		const insertInfo = await userCollection.insertOne(newUser);
		if (insertInfo.insertedCount === 0) throw 'Could not add user.';
		return await this.get(insertInfo.insertedId);
	},

	async updatePickEmsFuture(id, newPickEms, fightCardID) {
		const userCollection = await users();
		try {
			errorChecking.isValidObject(newPickEms, 'newPickEms');
		} catch (e) {
			throw e;
		}

		let user = await userCollection.findOne({ _id: id });
		if (user === null)
			throw 'Error: id provided does not correspond to a user.';
		let arr = [];
		//Create a new array of pickems (we overwrite previous pickems for that fightcard)
		for (let x of newPickEms) {
			//newPickems is [[id1], [id2]]
			x.push(null);
			//now its [[id1, null], [id2, null]]
		}
		user.pickEmsFuture[fightCardID] = newPickEms;
		const updatedUser = {
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			age: user.age,
			country: user.country,
			pickEmsFuture: user.pickEmsFuture,
			pickEmsPast: user.pickEmsPast,
			recentMessages: user.recentMessages,
		};

		const updatedInfo = await userCollection.updateOne(
			{ _id: id },
			{ $set: updatedUser },
		);

		user = await userCollection.findOne({ _id: id });
		return true;
	},

	async updateRecentMessages(id, newMessage) {
		const userCollection = await users();
		try {
			errorChecking.isValidObject(newMessage, 'newMessage');
			if (newMessage.boutcard_id) {
				errorChecking.isValidID(newMessage.boutcard_id, 'boutcard_id');
			}
			errorChecking.isValidString(newMessage.text, 'text');
			errorChecking.isValidString(newMessage.timestamp, 'timestamp');
			errorChecking.isValidID(newMessage.user_id, 'user_id');
			if (newMessage.parent != null) {
				errorChecking.isValidString(newMessage.parent, 'parent');
			}
		} catch (e) {
			throw e;
		}

		let parsedId;
		try {
			parsedId = ObjectId(id);
		} catch (e) {
			throw e.message;
		}

		const user = await userCollection.findOne({ _id: parsedId });
		if (user === null)
			throw 'Error: id provided does not correspond to a user.';
		let updatedRecentMessages = user.recentMessages;
		updatedRecentMessages.push(newMessage);
		if (updatedRecentMessages.length > 10) {
			updatedRecentMessages.shift();
		}
		const updatedUser = {
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			age: user.age,
			country: user.country,
			pickEmsFuture: user.pickEmsFuture,
			pickEmsPast: user.pickEmsPast,
			recentMessages: updatedRecentMessages,
		};

		const updatedInfo = await userCollection.updateOne(
			{ _id: parsedId },
			{ $set: updatedUser },
		);
		if (updatedInfo.modifiedCount === 0) {
			throw "Error: Could not update user's recentMessages.";
		}
	},

	async editMessage(id, messageId, editedText, newTimestamp) {
		const userCollection = await users();
		try {
			errorChecking.isValidObject(newMessage, 'newMessage');
			errorChecking.isValidString(newMessage.boutcard_id, 'boutcard_id');
			errorChecking.isValidString(newMessage.text, 'text');
			errorChecking.isValidString(newMessage.timestamp, 'timestamp');
			errorChecking.isValidString(newMessage.user_id, 'user_id');
			if (newMessage.parent != null) {
				errorChecking.isValidString(newMessage.parent, 'parent');
			}
		} catch (e) {
			throw e;
		}

		let parsedId;
		try {
			parsedId = ObjectId(id);
		} catch (e) {
			throw e.message;
		}

		const user = await userCollection.findOne({ _id: parsedId });
		if (user === null)
			throw 'Error: id provided does not correspond to a user.';
		let tenMessages = user.recentMessages;
		//let newArray = [];
		for (let mes of tenMessages) {
			if (mes._id.toString() === messageId) {
				// let edit = {
				// 	_id: mes._id,
				// 	boutcard_id: mes.boutcard_id,
				// 	text: editedText,
				// 	timestamp: newTimestamp,
				// 	user_id: mes.user_id,

				// };
				//newArray.push(edit);
				mes.text = editedText;
				mes.timestamp = newTimestamp;
			}
			//newArray.push(mes);
		}

		const updatedUser = {
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			age: user.age,
			country: user.country,
			pickEmsFuture: user.pickEmsFuture,
			pickEmsPast: user.pickEmsPast,
			recentMessages: tenMessages,
		};

		const updatedInfo = await userCollection.updateOne(
			{ _id: parsedId },
			{ $set: updatedUser },
		);
		if (updatedInfo.modifiedCount === 0) {
			throw "Error: Could not edit user's message.";
		}
	},

	async deleteMessage(id, messageId) {
		const userCollection = await users();
		try {
			errorChecking.isValidID(id, 'id'); // Why strings? Not ObjectIDs?
			errorChecking.isValidID(messageId, 'messageId'); // Why strings? Not ObjectIDs?
		} catch (e) {
			throw e;
		}

		let parsedId;
		try {
			parsedId = ObjectId(id);
		} catch (e) {
			throw e.message;
		}

		const user = await userCollection.findOne({ _id: parsedId });
		if (user === null)
			throw 'Error: id provided does not correspond to a user.';
		let tenMessages = user.recentMessages;
		let newArray = [];
		for (let mes of tenMessages) {
			if (mes._id.toString() != messageId.toString()) {
				newArray.push(mes);
			}
		}
		const updatedUser = {
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			age: user.age,
			country: user.country,
			pickEmsFuture: user.pickEmsFuture,
			pickEmsPast: user.pickEmsPast,
			recentMessages: newArray,
		};

		const updatedInfo = await userCollection.updateOne(
			{ _id: parsedId },
			{ $set: updatedUser },
		);
		if (updatedInfo.deletedCount === 0) {
			throw "Error: Could not edit user's message.";
		}
	},
	async getGlobalUserStats() {
		const globalUsers = await this.getAllUsers();
		const worldDict = {};
		for (let user of globalUsers) {
			if (user.country === null) continue;
			if (user.country in worldDict) {
				worldDict[`${user.country}`] += 1;
			} else {
				worldDict[`${user.country}`] = 1;
			}
		}
		const entries = Object.entries(worldDict);
		return entries;
	},
};
