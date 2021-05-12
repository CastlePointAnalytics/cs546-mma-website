$(document).ready(()=>{
    // $('a.replyLink').click((e)=>{
    //     e.preventDefault();
    //     $('a + .repliesContainer').show();
    //     let form = '<>'
    // });

    // function bindEventtoForm(form){
    //     form.submit((event)=>{
    //         event.preventDefault();
    //         $.ajax({
    //             url: form.action, //get a away to get boutid for url
    //             method: 'POST', 
    //             data: JSON.stringify({
    //                 text: $('#messageText'),
    //                 parent: "NoParent"
    //             })
    //         }).then((newMessage)=>{

    //         });
    //     });
    // }

    $('a.deleteLink').click((e)=>{
        e.preventDefault();
        $.ajax({
            url: e.target.href,
            method: "DELETE"
        }).then((result)=>{
            if(result.notLoggedIn){
                alert("User not logged in!");
            }else if(result.wrongUser){
                alert("Currently logged in user is not original Poster. Please re-login if you feel this is a mistake");
            }else if(result.deleteMessageError){
                alert("Server error! Could not delete message. Please try again!")
            }
            else{
                $(`#${result.result.deleted}`).remove();
                $(`#${result.result.deleted}_EL`).remove();
                $(`#${result.result.deleted}_DL`).remove();
                $(`#${result.result.deleted}_editForm`).remove();
            }
        });
    });


    $('a.editLink').click((e)=>{
        e.preventDefault();
        // $(e.next().next()).show();
        //console.log(e);
        let arr = e.target.attributes.id.nodeValue.split("_");
        let id = arr[0];
        $(`#${id}_editForm`).show();
    });

    $('form.editMessage').submit((event)=>{
        event.preventDefault();
        let arr = event.target.attributes.id.nodeValue.split("_");
        let id = arr[0];
        $.ajax({
            url: $(`#${id}_path`).val(),
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify({
                text: $(`#${id}_editText`).val()
            })
        }).then((result)=>{
            if(result.notLoggedIn){
                alert("User not logged in!");
            }else if(result.textError){
                alert("Text input incorrect! Please fix text entry");
            }else if(result.wrongUser){
                alert("Currently logged in user is not original Poster. Please re-login if you feel this is a mistake");
            }else if(result.updateMessageError){
                alert("Server error! Could not update message. Please try again!");
            }
            else{
                $(`#${id}_text`).text(result.editedMessage.text);
                $(`#${id}_timestamp`).text(result.editedMessage.timestamp);
                $(`#${id}_editForm`).hide();
            }
        });
    })

    $('#postMessage').submit((event)=>{
        event.preventDefault();
        $.ajax({
            url: $('#path').val(),
            method: 'POST',
            contentType: 'application/json',
            data : JSON.stringify({
                text: $('#messageText').val(),
            })
        }).then((result)=>{
            if(result.messageError){
                alert("Server error! Could not create new message. Please try again!");
            }else if(result.textError){
                alert("Text input incorrect! Please fix text entry");
            }else{
                let id = result.newMessage._id;
                let div = `<div class='message' id=${id}>`
                let username = `<p class='username'>${result.newMessage.username}</p>`;
                let text = `<p class='text'>${result.newMessage.text}</p>`;
                let timestamp = `<p class='time'>${result.newMessage.timestamp}</p>`;
                let innerdiv = '<div class=links>';
                let edit = `<a class="editLink" id="${id}_EL" href=''>Edit</a>`;
                let del = `<a class="deleteLink" id="${id}_DL" href="/messages/${id}">Delete</a>`;
                let form = `<form hidden class="editMessage" id="${id}_editForm">`;
                let hidden = `<input hidden id='${id}_path' value="/messages/${id}"/>`
                let label = `<label for="${id}_editText" id='${id}_messageLabel'>Edit Message</label>`
                let newText = `<input id="${id}_editText" type="text" placeholder="Enter New Message" required/>`
                let button = `<button id="${id}_editPost" type="submit">Edit</button>`
                innerdiv += edit + del + form + hidden + label + newText + button + "</form> </div>"
                div = div + username + text + timestamp + innerdiv + "</div>"
                $('#messageContainer').append(div);
            }
        });
    });
})