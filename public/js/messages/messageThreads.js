let postMessageForm = document.getElementById('postMessage');
let messageText = document.getElementById('messageText');

if(postMessageForm){
    postMessageForm.addEventListener('submit', (event)=>{
        event.preventDefault();
        if(!messageText.value){
            // might do an error Div but idk, will decide after CSS is finished
            postMessageForm.reset();
        }
    });
}