const express = require('express');
const router = express.Router();
const data = require('../data');
const messagesData = data.messages;
const userData = data.users;
const boutData = data.boutOdds;
let forumData = data.forum;
const fightCardData = data.fightCards;

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
                        bool: true,
                    }
        // if(request.cookies.user){
        //     user.bool = true//,
        //     //user.id = request.cookies.user.value
        // }
        response.render('messages/singleBout', {messages: messages, bout: bout, currentUser: user}); // Render basic handlebar with list of messages
    }catch(e){
        response.status(500).send({error: 'Could not get bout message thread'});
        console.log(e);
        return;
    }
});

router.post('/:bout_id', async (request, response)=>{
    let timestamp = new Date();

    const text = request.body.text;

    if(!text){
        console.log('error');
        return;
    }
    // if(!message.user_id){
    //     response.status(400).render('error'); // Render error message (*check lecture code*)
    //     return;
    // }
    // if(!message.parent){ // parent not neccessary fix this
    //      response.status(400).render('error'); // Render error message (*check lecture code*)
    //      return;
    // }
   
    try{
        const user_id = "3"//request.cookies.user.value; // something like that
        const username = "posted_user"; //await userData.get(user_id).username;
        const newMessage = await messagesData.createMessage(request.params.bout_id, text, timestamp, user_id, username);
        //await userData.update(); // Need update function from Ellie
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
    try{
        const result = await messagesData.deleteMessage(request.params.message_id, '2');
        //await userData.deleteMessage(); // Need delete function from Ellie
        // response.redirect(`/messages/${message.boutcard_Id}`);
        response.json(result)
    }catch(e){
        response.status(500).send({error:'Could not delete post'});
        return;
    }
});

router.put('/:message_id', async (request, response) =>{
    let timestamp = new Date();
    
    let text = request.body.text;
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
    let user_id ='1';
    try{
        let updatedMessage = await messagesData.updateMessage(request.params.message_id, text, user_id, timestamp);
        //await userData.update(); // Need update function from Ellie
        //response.redirect(`/messages/${message.boutcard_Id}`); 
        response.json(updatedMessage);
    }catch(e){
        response.status(500).send({error: "Could not update post"});
        console.log("Error updating message");
        return;
    } 
});

module.exports = router;
