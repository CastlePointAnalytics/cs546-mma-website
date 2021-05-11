const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const bcrypt = require('bcryptjs');
const saltRounds = 2;
const errorChecking = require('../errorChecking');
let { ObjectId } = require('mongodb');

//<script src="https://gist.github.com/incredimike/1469814.js"></script>
const COUNTRIES = {
	AF: 'Afghanistan',
	AL: 'Albania',
	DZ: 'Algeria',
	AS: 'American Samoa',
	AD: 'Andorra',
	AO: 'Angola',
	AI: 'Anguilla',
	AQ: 'Antarctica',
	AG: 'Antigua and Barbuda',
	AR: 'Argentina',
	AM: 'Armenia',
	AW: 'Aruba',
	AU: 'Australia',
	AT: 'Austria',
	AZ: 'Azerbaijan',
	BS: 'Bahamas (the)',
	BH: 'Bahrain',
	BD: 'Bangladesh',
	BB: 'Barbados',
	BY: 'Belarus',
	BE: 'Belgium',
	BZ: 'Belize',
	BJ: 'Benin',
	BM: 'Bermuda',
	BT: 'Bhutan',
	BO: 'Bolivia (Plurinational State of)',
	BQ: 'Bonaire, Sint Eustatius and Saba',
	BA: 'Bosnia and Herzegovina',
	BW: 'Botswana',
	BV: 'Bouvet Island',
	BR: 'Brazil',
	IO: 'British Indian Ocean Territory (the)',
	BN: 'Brunei Darussalam',
	BG: 'Bulgaria',
	BF: 'Burkina Faso',
	BI: 'Burundi',
	CV: 'Cabo Verde',
	KH: 'Cambodia',
	CM: 'Cameroon',
	CA: 'Canada',
	KY: 'Cayman Islands (the)',
	CF: 'Central African Republic (the)',
	TD: 'Chad',
	CL: 'Chile',
	CN: 'China',
	CX: 'Christmas Island',
	CC: 'Cocos (Keeling) Islands (the)',
	CO: 'Colombia',
	KM: 'Comoros (the)',
	CD: 'Congo (the Democratic Republic of the)',
	CG: 'Congo (the)',
	CK: 'Cook Islands (the)',
	CR: 'Costa Rica',
	HR: 'Croatia',
	CU: 'Cuba',
	CW: 'Curaçao',
	CY: 'Cyprus',
	CZ: 'Czechia',
	CI: "Côte d'Ivoire",
	DK: 'Denmark',
	DJ: 'Djibouti',
	DM: 'Dominica',
	DO: 'Dominican Republic (the)',
	EC: 'Ecuador',
	EG: 'Egypt',
	SV: 'El Salvador',
	GQ: 'Equatorial Guinea',
	ER: 'Eritrea',
	EE: 'Estonia',
	SZ: 'Eswatini',
	ET: 'Ethiopia',
	FK: 'Falkland Islands (the) [Malvinas]',
	FO: 'Faroe Islands (the)',
	FJ: 'Fiji',
	FI: 'Finland',
	FR: 'France',
	GF: 'French Guiana',
	PF: 'French Polynesia',
	TF: 'French Southern Territories (the)',
	GA: 'Gabon',
	GM: 'Gambia (the)',
	GE: 'Georgia',
	DE: 'Germany',
	GH: 'Ghana',
	GI: 'Gibraltar',
	GR: 'Greece',
	GL: 'Greenland',
	GD: 'Grenada',
	GP: 'Guadeloupe',
	GU: 'Guam',
	GT: 'Guatemala',
	GG: 'Guernsey',
	GN: 'Guinea',
	GW: 'Guinea-Bissau',
	GY: 'Guyana',
	HT: 'Haiti',
	HM: 'Heard Island and McDonald Islands',
	VA: 'Holy See (the)',
	HN: 'Honduras',
	HK: 'Hong Kong',
	HU: 'Hungary',
	IS: 'Iceland',
	IN: 'India',
	ID: 'Indonesia',
	IR: 'Iran (Islamic Republic of)',
	IQ: 'Iraq',
	IE: 'Ireland',
	IM: 'Isle of Man',
	IL: 'Israel',
	IT: 'Italy',
	JM: 'Jamaica',
	JP: 'Japan',
	JE: 'Jersey',
	JO: 'Jordan',
	KZ: 'Kazakhstan',
	KE: 'Kenya',
	KI: 'Kiribati',
	KP: "Korea (the Democratic People's Republic of)",
	KR: 'Korea (the Republic of)',
	KW: 'Kuwait',
	KG: 'Kyrgyzstan',
	LA: "Lao People's Democratic Republic (the)",
	LV: 'Latvia',
	LB: 'Lebanon',
	LS: 'Lesotho',
	LR: 'Liberia',
	LY: 'Libya',
	LI: 'Liechtenstein',
	LT: 'Lithuania',
	LU: 'Luxembourg',
	MO: 'Macao',
	MG: 'Madagascar',
	MW: 'Malawi',
	MY: 'Malaysia',
	MV: 'Maldives',
	ML: 'Mali',
	MT: 'Malta',
	MH: 'Marshall Islands (the)',
	MQ: 'Martinique',
	MR: 'Mauritania',
	MU: 'Mauritius',
	YT: 'Mayotte',
	MX: 'Mexico',
	FM: 'Micronesia (Federated States of)',
	MD: 'Moldova (the Republic of)',
	MC: 'Monaco',
	MN: 'Mongolia',
	ME: 'Montenegro',
	MS: 'Montserrat',
	MA: 'Morocco',
	MZ: 'Mozambique',
	MM: 'Myanmar',
	NA: 'Namibia',
	NR: 'Nauru',
	NP: 'Nepal',
	NL: 'Netherlands (the)',
	NC: 'New Caledonia',
	NZ: 'New Zealand',
	NI: 'Nicaragua',
	NE: 'Niger (the)',
	NG: 'Nigeria',
	NU: 'Niue',
	NF: 'Norfolk Island',
	MP: 'Northern Mariana Islands (the)',
	NO: 'Norway',
	OM: 'Oman',
	PK: 'Pakistan',
	PW: 'Palau',
	PS: 'Palestine, State of',
	PA: 'Panama',
	PG: 'Papua New Guinea',
	PY: 'Paraguay',
	PE: 'Peru',
	PH: 'Philippines (the)',
	PN: 'Pitcairn',
	PL: 'Poland',
	PT: 'Portugal',
	PR: 'Puerto Rico',
	QA: 'Qatar',
	MK: 'Republic of North Macedonia',
	RO: 'Romania',
	RU: 'Russian Federation (the)',
	RW: 'Rwanda',
	RE: 'Réunion',
	BL: 'Saint Barthélemy',
	SH: 'Saint Helena, Ascension and Tristan da Cunha',
	KN: 'Saint Kitts and Nevis',
	LC: 'Saint Lucia',
	MF: 'Saint Martin (French part)',
	PM: 'Saint Pierre and Miquelon',
	VC: 'Saint Vincent and the Grenadines',
	WS: 'Samoa',
	SM: 'San Marino',
	ST: 'Sao Tome and Principe',
	SA: 'Saudi Arabia',
	SN: 'Senegal',
	RS: 'Serbia',
	SC: 'Seychelles',
	SL: 'Sierra Leone',
	SG: 'Singapore',
	SX: 'Sint Maarten (Dutch part)',
	SK: 'Slovakia',
	SI: 'Slovenia',
	SB: 'Solomon Islands',
	SO: 'Somalia',
	ZA: 'South Africa',
	GS: 'South Georgia and the South Sandwich Islands',
	SS: 'South Sudan',
	ES: 'Spain',
	LK: 'Sri Lanka',
	SD: 'Sudan (the)',
	SR: 'Suriname',
	SJ: 'Svalbard and Jan Mayen',
	SE: 'Sweden',
	CH: 'Switzerland',
	SY: 'Syrian Arab Republic',
	TW: 'Taiwan',
	TJ: 'Tajikistan',
	TZ: 'Tanzania, United Republic of',
	TH: 'Thailand',
	TL: 'Timor-Leste',
	TG: 'Togo',
	TK: 'Tokelau',
	TO: 'Tonga',
	TT: 'Trinidad and Tobago',
	TN: 'Tunisia',
	TR: 'Turkey',
	TM: 'Turkmenistan',
	TC: 'Turks and Caicos Islands (the)',
	TV: 'Tuvalu',
	UG: 'Uganda',
	UA: 'Ukraine',
	AE: 'United Arab Emirates (the)',
	GB: 'United Kingdom of Great Britain and Northern Ireland (the)',
	UM: 'United States Minor Outlying Islands (the)',
	US: 'United States of America (the)',
	UY: 'Uruguay',
	UZ: 'Uzbekistan',
	VU: 'Vanuatu',
	VE: 'Venezuela (Bolivarian Republic of)',
	VN: 'Viet Nam',
	VG: 'Virgin Islands (British)',
	VI: 'Virgin Islands (U.S.)',
	WF: 'Wallis and Futuna',
	EH: 'Western Sahara',
	YE: 'Yemen',
	ZM: 'Zambia',
	ZW: 'Zimbabwe',
	AX: 'Åland Islands',
};

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
			country: COUNTRIES[country],
		};
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
		//id = id.toString();
		//return await this.get(id);
	}, //end updateRecentMessages

	async editMessage(id, messageId, editedText, newTimestamp) {
		const userCollection = await users();
		//error checking...
		// try {
		// 	er.isValidObject(newMessage, 'newMessage');
		// 	er.isValidString(newMessage.boutcard_id, 'boutcard_id');
		// 	er.isValidString(newMessage.text, 'text');
		// 	er.isValidString(newMessage.timestamp, 'timestamp');
		// 	er.isValidString(newMessage.user_id, 'user_id');
		// 	if (newMessage.parent != null) {
		// 		er.isValidString(newMessage.parent, 'parent');
		// 	}
		// } catch (e) {
		// 	throw e;
		// }
		//done with error checking

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
		//id = id.toString();
		//return await this.get(id);
	}, //end editMessage

	async deleteMessage(id, messageId) {
		const userCollection = await users();
		//error checking...
		// try {
		// 	er.isValidString(id, 'id');
		// 	er.isValidString(messageId, 'messageId');
		// } catch (e) {
		// 	throw e;
		// }
		//done with error checking

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
			if (mes._id != messageId) {
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
		//id = id.toString();
		//return await this.get(id);
	},
	async getGlobalUserStats() {
		const users = await this.getAllUsers();
		const worldDict = {};
		for (let user of users) {
			if (user.country === null) break;
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
