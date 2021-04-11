const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
const errorChecking = require('../errorChecking');
const er = errorChecking.checker;

module.exports = {
    async get(id) {
        try{
            er.isValidString(id, "id");
        }catch(e){
            throw e;
        }
        const userCollection = await users();
        // let userId = mongodb.ObjectId(id);
        const user = await userCollection.findOne({ _id: id });//?
        if (user === null) throw 'No book with that id';
        user._id = user._id.toString();
        return user;
      },
    async create( username, firstName, lastName, age, country ){
        const userCollection = await users();
        //error checking...
        try{
            er.isValidString(username, "username");
            er.isValidString(firstName, "firstName");
            er.isValidString(lastName, "lastName");
            er.isValidAge(age,"age");
            er.isValidString(country, "country");
        }catch(e){
            throw e;
        }
        //done with error checking
        let newUser = {
            username: username,
            firstName: firstName,
            lastName: lastName,
            age: age,
            country: country
        }
        const insertInfo = await userCollection.insertOne(newUser);
        if (insertInfo.insertedCount === 0) throw 'Could not add user.';
        const newId = insertInfo.insertedId;
        const user = await this.get(newId.toString());
        user._id = user._id.toString();
        return user;
    }//end create

};
