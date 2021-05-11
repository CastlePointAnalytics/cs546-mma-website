let { ObjectId } = require('mongodb');

function isNotEmptyString(string, stringName) {
	if (string === '' || string.trim() === '') {
		throw `${stringName || 'Provided value'} cannot be an empty string`;
	}
}
function isEmptyArray(array, arrName) {
	if (array.length === 0)
		throw `${arrName || 'Provided value'} cannot be an empty array`;
}
async function isEmptyObject(obj, objName) {
	if (Object.entries(obj).length === 0)
		throw `${objName || 'Provided value'} cannot be an empty object`;
}

function isValidWholeNumber(num, numName) {
	if (num % 1 !== 0)
		throw `${numName || 'Provided value'} must be a whole number`;
}

function isValidNumber(num, numName) {
	if (!num || typeof num !== 'number') {
		throw `${numName || 'Provided value'} must be of type 'number'`;
	}
}

function isValidBooelean(bool, boolName) {
	if (bool === undefined || typeof bool !== 'boolean') {
		throw `${boolName || 'Provided value'} must be of type 'boolean'`;
	}
}

function isValidString(string, stringName) {
	if (!string) throw stringName + `Error: ${stringName} was not provided.`;
	if (!isNaN(string)) throw stringName + `Error: ${stringName} is a number`;
	if (typeof string != 'string')
		throw `Error: ${stringName} is not of type string.`;
	if (string.trim() == '') throw `Error: ${stringName} is an empty string.`;
}

function isValidObject(object, objectName) {
	if (!object) throw objectName + `Error: ${objectName} was not provided.`;
	if (typeof object != 'object')
		throw `Error: ${objectName} is not of type object.`;
}

function isValidArray(arr, arrName) {
	if (!arr) throw arrName + `Error: ${arrName} was not provided.`;
	if (!Array.isArray(arr)) throw `Error: ${arrName} is not of type array.`;
	if (arr.length === 0) throw `Error: ${arrName} is an empty array.`;
}

function elementsInArrayValidStrings(arr, arrName) {
	for (let element of arr) {
		isValidString(element, 'one or more elements in ' + arrName);
	}
}

function isValidDate(date, dateName) {
	let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	let dateSplit = date.split('/');
	if (dateSplit.length !== 3)
		throw `Error: ${dateName} must be a valid date. (MM/DD/YYYY)`;
	for (i in dateSplit) {
		dateSplit[i] = parseInt(dateSplit[i]);
	}
	isValidNumber(dateSplit[0], 'Month', true);
	isValidNumber(dateSplit[1], 'Day', true);
	isValidNumber(dateSplit[2], 'Year', true);
	// check that this is a valid month
	if (dateSplit[0] < 1 || dateSplit[0] > 12)
		throw 'Error: Month must be between 1 and 12 inclusive';
	// check that this day is valid
	if (
		(dateSplit[0] === 2 && dateSplit[2] % 4 === 0 && dateSplit[1] > 29) ||
		dateSplit[1] > monthLength[dateSplit[0] - 1]
	)
		throw 'Error: Invalid number of days for month';
	// check that this year is valid
	if (dateSplit[2] < 0) throw 'Error: Invalid year.';
}

function isValidAge(age, ageName) {
	if (!age) throw ageName + `Error: ${ageName} was not provided.`;
	if (isNaN(age)) throw `Error: ${ageName} is not a number.`;
}

function isValidCountry(country, countryName) {}

function isValidID(id, idName) {
	if (!id) throw `${idName} was not provided`;
	if (!ObjectId.isValid(id)) throw `${idName} is not a valid MongoDB ID.`;
}

module.exports = {
	isNotEmptyString,
	isValidDate,
	isValidString,
	isValidBooelean,
	isValidArray,
	isValidObject,
	isValidNumber,
	isValidString,
	isValidObject,
	isValidArray,
	elementsInArrayValidStrings,
	isValidAge,
	isValidCountry,
	isValidID,
};
