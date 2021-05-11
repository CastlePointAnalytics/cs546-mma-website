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
        response.status(500).render('messages/error', {previousPage: '/'}); // render an error page
        return;
    }
    response.render('messages/forumHomepage', {upcoming: forumData, css: "messages/landing.css"});
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
        response.render('messages/singleBout', {messages: messages, bout: bout, currentUser: user, css:"messages/bout.css"}); // Render basic handlebar with list of messages
    }catch(e){
        response.status(500).render('messages/error', {previousPage: '/messages/'}); // render an error page
        console.log(e);
        return;
    }
});

router.post('/:bout_id', async (request, response)=>{
    let timestamp = new Date();

    let text = xss(request.body.text);
    const user = request.session.user;

    text = text.trim();
    if(!text || typeof text != 'string' || text.length <1){
        response.json({textError: true});
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
    const user_id = user.id;
    const username = user.username;
    let newMessage;
    try{
        newMessage = await messagesData.createMessage(xss(request.params.bout_id), text, timestamp, user_id.toString(), username);
        response.json({newMessage});
    }catch(e){
        console.log(`Error creating message: ${e}`);
        response.json({messageError: true}); 
        return;
    }
    try{
        await userData.updateRecentMessages(user_id, newMessage); // Need update function from Ellie
    }catch(e){
        console.log(`Error updating user data: ${e}`);
    }
});

router.delete('/:message_id', async (request, response) => {
    if(!request.session.user){
        response.json({notLoggedIn:true});
        return;
    }
    let message;
    try{
       message = await messagesData.getMessage(request.params.message_id);
    }catch(e){
        console.log(`Error getting message: ${e}`);
        response.json({getMessageError: true}); 
        return;
    }
    let user_id = request.session.user.id;
    try{
        const result = await messagesData.deleteMessage(message._id.toString(), user_id);//xss(request.session.user.id));
        response.json({result});
        // response.redirect(`/messages/${message.boutcard_Id}`);   
    }catch(e){
        console.log(`Error deleting message: ${e}`);
        if(e='Request came from unauthorized user!'){
            response.json({wrongUser:true});
        }else{
            response.json({deleteMessageError: true}); 
        }
        return;
    }try{
        await userData.deleteMessage(user_id, message._id); // Need delete function from Ellie
    }catch(e){
        console.log(`Error updating user data: ${e}`);
    }

    
});

router.put('/:message_id', async (request, response) =>{
    if(!request.session.user){
        response.json({notLoggedIn:true});
        return;
    }
    let timestamp = new Date();
    
    let text = xss(request.body.text);
    //const user_id = request.body.user_id;

    text = text.trim();
    if(!text || typeof text != 'string' || text.length <1){
        response.json({textError: true});
        return;
    }
    
    try{
        await messagesData.getMessage(request.params.message_id);
    }catch(e){
        console.log(`Error getting message: ${e}`);
        response.json({getMessageError: true}); 
        return;
    }
    let user_id = request.session.user.id;
    try{
        let editedMessage = await messagesData.updateMessage(request.params.message_id, text, user_id, timestamp);
       
        //response.redirect(`/messages/${message.boutcard_Id}`); 
        response.json({editedMessage});
    }catch(e){
        console.log(`Error updating message: ${e}`);
        if(e='Request came from unauthorized user!'){
            response.json({wrongUser:true});
        }else{
            response.json({updateMessageError: true}); 
        }
        return;
    }try{
        await userData.editMessage(user_id, request.params.message_id, text, timestamp); // Need update function from Ellie
    }
    catch(e){
        console.log(`Error updating user data: ${e}`);
    }
});

module.exports = router;
