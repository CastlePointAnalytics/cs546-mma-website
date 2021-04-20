/**
 * Throws errors if thing d.n.e., if it is not a string, if it is an empty string, or if it is just spaces.
 * @param {*} str thing being checked
 * @param {string} thingStr the string name of what you're checking 
 */
 function isValidString(str, thingStr){
    if(!str) throw thingStr + `Error: ${thingStr} was not provided.`;
    if(typeof(str)!='string') throw `Error: ${thingStr} is not of type string.`;
    if(str.trim() == "") throw `Error: ${thingStr} is an empty string.`;
}
/**
 * Throws errors if thing d.n.e., if it is not an object.
 * @param {*} str thing being checked
 * @param {string} thingStr the string name of what you're checking 
 */
function isValidObject(obj, thingStr){
    if(!obj) throw thingStr + `Error: ${thingStr} was not provided.`;
    if(typeof(obj)!='object') throw `Error: ${thingStr} is not of type object.`;
}

/**
 * Throws errors if thing d.n.e., if it is not an array, if array is empty.
 * @param {*} str thing being checked
 * @param {string} thingStr the string name of what you're checking 
 */
 function isValidArray(arr, thingStr){
    if(!arr) throw thingStr + `Error: ${thingStr} was not provided.`;
    if(!Array.isArray(arr)) throw `Error: ${thingStr} is not of type array.`;
    if(arr.length === 0) throw `Error: ${thingStr} is an empty array.`;
}

/**
 * Iterates through array's elements.
 * Throws errors on element if it is not a string, if it is an empty string, or if it is just spaces.
 * @param {Array} arr array being checked
 * @param {string} thingStr the string name of the array you're checking 
 */
 function elementsInArrayValidStrings(arr, thingStr){
    for (let element of arr){
        isValidString(element, "one or more elements in " +thingStr);
    }
}

/**
 * Checks if thing is valid date format.
 * Throws errors if thing is not a string in the format of a valid date x/x/x.
 * @param {*} date thing being checked
 * @param {string} thingStr the string name of the array you're checking 
 */
function isValidDateString(date, thingStr){
    isValidString(date, thingStr);
    try{
        let d = new Date(date);
    }catch(e){
        throw `Error: ${thingStr} is not of proper date type`;
    }
}

/**
 * Checks if rating is an integer between 1 and 5
 * Throws errors otherwise.
 * @param {*} date thing being checked
 * @param {string} thingStr the string name of the array you're checking 
 */
 function isValidRating(rating, thingStr){
    if(!rating) throw thingStr + `Error: ${thingStr} was not provided.`;
    if(rating !== 1 && rating !== 2 && rating !== 3 && rating !== 4 && rating !== 5)
        throw `Error: ${thingStr} is not an integer between 1 and 5.`;
}

/**
 * Throws errors if age d.n.e., if it is not a positive integer under over 0 and under 130.
 * @param {*} age thing being checked
 * @param {string} thingStr the string name of what you're checking 
 */
 function isValidAge(age, thingStr){
    if(!age) throw thingStr + `Error: ${thingStr} was not provided.`;
    if(Number.isInteger(age)) throw `Error: ${thingStr} is not an integer.`;
    if (age>130 || age<1) throw `Error: ${thingStr} is not a valid age.`;
}

module.exports  = {isValidString, isValidObject, isValidArray, elementsInArrayValidStrings,isValidDateString, isValidRating, isValidAge};
