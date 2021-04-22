const mongoCollections = require('../config/mongoCollections');
const messages = mongoCollections.messages;
let {ObjectId} = require('mongodb');


module.exports = {
    async getMessage(id){
        id = id.trim();
        if(!id || typeof id != 'string' || id.length < 1) throw "Could not get id for message!"
        
        let parsedId;
        try{
            parsedId = ObjectId(id);
        }catch(e){
            throw e.message;
        }

        const collection = await messages();

        const message = await collection.findOne({_id: parsedId}); // maybe use a projcetion to alter what is queried. May not need it all

        if(message === null) throw 'Could not get message!'

        return message
    },

    async getAllMessagesFromBout(boutcard_Id){
        boutcard_Id = boutcard_Id.trim();
        if(!boutcard_Id || typeof boutcard_Id != 'string' || boutcard_Id.length < 1) throw "Bout ID passed was invalid type" 

        const collection = await messages();

        const messageList = await collection.find({boutcard_Id: boutcard_Id}).toArray();
        if(messageList.length === 0) throw 'Could not find messages for provided fight!'

        // need to sort by timestamp

        messageList.sort((a,b) => a.timestamp - b.timestamp);

        return messageList;
    },

    // async getAllMessagesFromUser(user_id){
    //     user_id = user_id.trim();
    //     if(!user_id || typeof user_id != 'string' || user_id.length < 1) throw "User ID passed was invalid type"

    //     const collection = await messages();
        
    //     const messageList = await collection.find({user_id: user_id}).toArray();

    //     if(messageList.length == 0) throw 'Could not find messages for provided user!'

    //     return messageList;
    // },

    async createMessage(boutcard_Id, text, timestamp, user_id, username, parent){
        boutcard_Id = boutcard_Id.trim();
        if(!boutcard_Id || typeof boutcard_Id != 'string' || boutcard_Id.length < 1) throw "Bout ID passed was invalid type" // would be an internal server error, not user
        text = text.trim();
        if(!text || typeof text != 'string' || text.length < 1) throw "Please input text!"
        user_id = user_id.trim();
        if(!user_id || typeof user_id != 'string' || user_id.length < 1) throw "User ID passed was invalid type" // would be an internal server error, not user
        parent = parent.trim();
        if(!parent || typeof parent != 'string' || parent.length < 1) throw "Parent id of incorrect type" // would be an internal server error, not user
        if(parent === 'NoParent'){
            parent = null;
        }
        if(!timestamp || typeof timestamp.toString() != 'string') throw "Timestamp error" // Server error, not user

        username = username.trim();
        if(!username || typeof username != 'string' || username.length < 1)throw "Username pass was invalid type" // would be an internal server error, not user
        

        let newMessage = {
            boutcard_Id: boutcard_Id,
            text: text,
            timestamp: timestamp,
            user_id: user_id,
            username: username,
            parent: parent
        }

        const collection = await messages();
        
        const insertInfo = await collection.insertOne(newMessage);

        if(insertInfo.insertedCount === 0) throw "Failed to insert messsage"

        return await this.getMessage(insertInfo.insertedId.toString());
    },

    async updateMessage(id, text, user_id, timestamp){
        id = id.trim();
        if(!id || typeof id != 'string' || id.length < 1) throw "Could not get id for message!"
        
        let message = await this.getMessage(id);

        user_id = user_id.trim();
        if(!user_id || typeof user_id != 'string' || user_id.length < 1) throw "User ID passed was invalid type"

        if(message.user_id != user_id) throw 'Request came from unauthorized user!'

        text = text.trim();
        if(!text || typeof text != 'string' || text.length < 1) throw "Please input text!"

        const collection = await messages();

        let newText = {
            text: text,
            timestamp: timestamp
        }

        let parsedId;
        try{
            parsedId = ObjectId(id);
        }catch(e){
            throw e.message;
        }

        const updateInfo = await collection.updateOne({_id: parsedId}, {$set: newText});
        if(updateInfo.modifiedCount === 0) throw "Could not update message";

        return await this.getMessage(id);
    },

    async deleteMessage(id, user_id){
        id = id.trim();
        if(!id || typeof id != 'string' || id.length < 1) throw "Could not get id for message!"

        let message = await this.getMessage(id);

        user_id = user_id.trim();
        if(!user_id || typeof user_id != 'string' || user_id.length < 1) throw "User ID passed was invalid type"

        if(message.user_id != user_id) throw 'Request came from unauthorized user!'

        const collection = await messages();       
        
        let parsedId;
        try{
            parsedId = ObjectId(id);
        }catch(e){
            throw e.message;
        }

        const deleteInfo = await collection.removeOne({_id: parsedId});

        if(deleteInfo.deletedCount === 0) throw 'Could not delete message!'

        return {deleted: true};
    }
};
