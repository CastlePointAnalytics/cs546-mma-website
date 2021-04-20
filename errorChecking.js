function checkIsEmptyString(string, name) {
    if (string === "" || string.trim() === "") {
        throw `${name || "Provided value"} cannot be an empty string`;
    }
}
function checkIsEmptyArray(array, name) {
    if (array.length === 0)
        throw `${name || "Provided value"} cannot be an empty array`;
}
async function checkIsEmptyObject(obj, name) {
    if (Object.entries(obj).length === 0)
        throw `${name || "Provided value"} cannot be an empty object`;
}

function checkIsWholeNumber(num, name) {
    if (num % 1 !== 0)
        throw `${name || "Provided value"} must be a whole number`;
}

function checkIsProperNumber(num, name, checkWholeNumber) {
    if (!num || typeof num !== "number") {
        throw `${name || "Provided value"} must be of type 'number'`;
    }
    if (checkWholeNumber) checkIsWholeNumber(num, name);
}

module.exports = {
    checkIsProperDate: (date, dateName) => {
        let monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let dateSplit = date.split("/");
        if (dateSplit.length !== 3)
            throw `Error: ${dateName} must be a valid date. (MM/DD/YYYY)`;
        for (i in dateSplit) {
            dateSplit[i] = parseInt(dateSplit[i]);
        }
        checkIsProperNumber(dateSplit[0], "Month", true);
        checkIsProperNumber(dateSplit[1], "Day", true);
        checkIsProperNumber(dateSplit[2], "Year", true);
        // check that this is a valid month
        if (dateSplit[0] < 1 || dateSplit[0] > 12)
            throw "Error: Month must be between 1 and 12 inclusive";
        // check that this day is valid
        if (
            (dateSplit[0] === 2 &&
                dateSplit[2] % 4 === 0 &&
                dateSplit[1] > 29) ||
            dateSplit[1] > monthLength[dateSplit[0] - 1]
        )
            throw "Error: Invalid number of days for month";
        // check that this year is valid
        if (dateSplit[2] < 0) throw "Error: Invalid year.";
    },
    checkIsProperString: (string, name, checkEmpty) => {
        if (!string || typeof string !== "string") {
            throw `${name || "Provided value"} must be of type 'string'`;
        }
        if (checkEmpty) checkIsEmptyString(string, name);
    },
    checkIsProperBoolean: (bool, name) => {
        if (bool === undefined || typeof bool !== "boolean") {
            throw `${name || "Provided value"} must be of type 'boolean'`;
        }
    },
    checkIsProperArray: (array, name, checkEmpty) => {
        if (!array || !Array.isArray(array)) {
            throw `${name || "Provided value"} must be of type 'array'`;
        }
        if (checkEmpty) checkIsEmptyArray(array, name);
    },
    checkIsProperObject: (obj, name, checkEmpty) => {
        if (!obj || typeof obj !== "object") {
            throw `${name || "Provided value"} must be of type 'object'`;
        }
        if (checkEmpty) checkIsEmptyObject(obj, name);
    },
    checkIsProperNumber,
};
