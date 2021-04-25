const express = require('express');
const router = express.Router();
const data = require('../data');
const messagesData = data.messages;
const userData = data.users;
const boutData = data.fightCards;
const path = require('path');

router.get('/', (request,response)=>{
    response.sendFile(path.resolve('./static/messages/allFights.html'));
});

router.get('/:bout_id', async (request, response)=>{
    try{
        const messages = await messagesData.getAllMessagesFromBout(request.params.bout_id);
        // const bout = boutData.___ // get bout Info
        response.render('messages/singleBout', {messages: messages, bout: bout}); // Render basic handlebar with list of messages
    }catch(e){
        response.status(500).send({error: 'Could not get bout message thread'});
        return;
    }
});

router.post('/:bout_id', async (request, response)=>{
    let timestamp = new Date();

    const message = request.body;

    if(!message.text){
        response.redirect(''); // Should be handled client-side. Any error is internal. Refer to lab 9
    }
    if(!message.user_id){
        response.status(400).render('error'); // Render error message (*check lecture code*)
        return;
    }
    if(!message.parent){ // parent not neccessary fix this
         response.status(400).render('error'); // Render error message (*check lecture code*)
         return;
    }
   
    try{
        const {text, parent} = message;
        const user_id = request.cookies.user.value; // something like that
        const username = await userData.get(user_id).username;
        await messagesData.createMessage(request.params.bout_id, text, timestamp, user_id, username, parent);
        await userData.update(); // Need update function from Ellie
        response.redirect(`/messages/${request.path}`); // Make sure this will work
    }catch(e){
        response.status(500).send({error: 'Could not create new post!'});
        return;
    }
});

router.delete('/:message_id', async (request, response) => {
    let message;
    try{
       message = await messagesData.getMessage(request.params.message_id);
    }catch(e){
        response.status(500).send({error:'Could not find post'});
        return;
    }
    try{
        await messagesData.deleteMessage(request.params.message_id, request.body.user_id);
        await userData.deleteMessage(); // Need delete function from Ellie
        response.redirect(`/messages/${message.boutcard_Id}`);
    }catch(e){
        response.status(500).send({error:'Could not delete post'});
        return;
    }
});

router.put('/:message_id', async (request, response) =>{
    let timestamp = new Date();
    
    const text = request.body.text;
    const user_id = request.body.user_id;

    text = text.trim();
    if(!text || typeof text != 'string' || text.length <1){
        response.status(400).render('error');
        return;
    }
    if(!user_id){
        response.status(500).send({error: "user was not passed"});
        return;
    }
    
    try{
        await messagesData.getMessage(request.params.message_id);
    }catch(e){
        response.status(500).send({error: "Could not find post"});
        return;
    }
    try{
        await messagesData.updateMessage(request.params.message_id, text, user_id, timestamp);
        await userData.update(); // Need update function from Ellie
        response.redirect(`/messages/${message.boutcard_Id}`); 
    }catch(e){
        response.status(500).send({error: "Could not update post"});
        return;
    } 
});

module.exports = router;
