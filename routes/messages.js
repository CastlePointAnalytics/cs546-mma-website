const express = require('express');
const router = express.Router();
const data = require('../data');
const messagesData = data.messages;
const userData = data.users;
const boutData = data.boutOdds;
let forumData = data.forum;
const fightCardData = data.fightCards;
const xss = require('xss');

router.get('/', async (request,response)=>{
    try{
        const upcomingFight = await fightCardData.getUpcomingFightCards();
        const bouts = upcomingFight[0].allBoutOdds;
        let boutIds = [];
        for(let bout of bouts){
            boutIds.push(bout._id);
        }
        let index = 0;
        for(let fight of forumData){
            fight.site_link = `${boutIds[index]}`;
            index++;
        }
    }catch(e){
        console.log(e);
        response.send({error:e});
        return;
    }
    response.render('messages/forumHomepage', {upcoming: forumData});
});

router.get('/:bout_id', async (request, response)=>{
    try{
        const messages = await messagesData.getAllMessagesFromBout(request.params.bout_id);
        const bout = await boutData.getBoutById(request.params.bout_id) // get bout Info
        let user = {
            bool: false
        }
        if(request.session.user){
             user.bool = true
             //user.id = request.cookies.user.value
        }
        response.render('messages/singleBout', {messages: messages, bout: bout, currentUser: user}); // Render basic handlebar with list of messages
    }catch(e){
        response.status(500).send({error: 'Could not get bout message thread'});
        console.log(e);
        return;
    }
});

router.post('/:bout_id', async (request, response)=>{
    let timestamp = new Date();

    const text = xss(request.body.text);
    const user = request.session.user;

    if(!text){
        console.log('error');
        return;
    }
    // if(!message.user_id){
    //     response.status(400).render('error'); // Render error message (*check lecture code*)
    //     return;
    // }
    // if(!user){

    // }
    // if(!message.parent){ // parent not neccessary fix this
    //      response.status(400).render('error'); // Render error message (*check lecture code*)
    //      return;
    // }
   
    try{
        const user_id = user.id;
        const username = user.username;
        const newMessage = await messagesData.createMessage(xss(request.params.bout_id), text, timestamp, user_id.toString(), username);
        await userData.updateRecentMessages(user_id, newMessage); // Need update function from Ellie
        response.json(newMessage);
    }catch(e){
        console.log(e);
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
    let user_id = request.session.user.id;
    try{
        const result = await messagesData.deleteMessage(message._id, user_id);//xss(request.session.user.id));
        await userData.deleteMessage(user_id, message._id); // Need delete function from Ellie
        // response.redirect(`/messages/${message.boutcard_Id}`);
        response.json(result)
    }catch(e){
        response.status(500).send({error:'Could not delete post'});
        console.log(e);
        return;
    }
});

router.put('/:message_id', async (request, response) =>{
    let timestamp = new Date();
    
    let text = xss(request.body.text);
    //const user_id = request.body.user_id;

    text = text.trim();
    if(!text || typeof text != 'string' || text.length <1){
        response.status(400).render('error');
        return;
    }
    // if(!user_id){
    //     response.status(500).send({error: "user was not passed"});
    //     return;
    // }
    
    try{
        await messagesData.getMessage(request.params.message_id);
    }catch(e){
        response.status(500).send({error: "Could not find post"});
        return;
    }
    let user_id = request.session.user.id;
    try{
        let updatedMessage = await messagesData.updateMessage(request.params.message_id, text, user_id, timestamp);
        await userData.editMessage(user_id, request.params.message_id, text, timestamp); // Need update function from Ellie
        //response.redirect(`/messages/${message.boutcard_Id}`); 
        response.json(updatedMessage);
    }catch(e){
        response.status(500).send({error: "Could not update post"});
        console.log(e);
        return;
    } 
});

module.exports = router;
