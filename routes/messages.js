const express = require('express');
const router = express.Router();
const data = require('../data');
const messagesData = data.messages;
const userData = data.users;

router.get('/', (request,response)=>{
    response.render(); // Render handlebars with different bout forum options
});

router.get('/:bout_id', async (request, response)=>{
    try{
        const messages = await messagesData.getAllMessagesFromBout(request.params.bout_id);
        // get usernames somehow
        response.render('', {messages: messages}); // Render basic handlebar with list of messages
    }catch(e){
        response.status(500).send({error: 'Could not get bout message thread'});
        return;
    }
});

router.post('/:bout_id', async (request, response)=>{
    let timestamp = new Date();

    const message = request.body;

    if(!message.text){
        response.status(400).render('error'); // Render error message (*check lecture code*) 
        return; // might be a redirect idk
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
        const {text, user_id, parent} = message
        await messagesData.createMessage(request.params.bout_id, text, timestamp, user_id, parent);
        await userData.update(); // Need update function from Ellie
        response.redirect(request.path); // Make sure this will work
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
        response.redirect(`/${message.boutcard_Id}`);
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
        await userData.update() // Need update function from Ellie
        response.redirect(`/${message.boutcard_Id}`); 
    }catch(e){
        response.status(500).send({error: "Could not update post"});
        return;
    } 
});

module.exports = router;
