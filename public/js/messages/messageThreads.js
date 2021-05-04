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
            $(`#${result.deleted}`).remove();
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
                text: $(`#${id}_editText`).val(),
                user: $(`#${id}_user`).val()
            })
        }).then((editedMessage)=>{
            $(`#${id}_text`).text(editedMessage.text);
            $(`#${id}_timestamp`).text(editedMessage.timestamp);
            $(`#${id}_editForm`).hide();
        })
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
        }).then((newMessage)=>{
            let div = "<div class='message'>"
            let username = `<p class='username'>${newMessage.username}</p>`;
            let text = `<p class='text'>${newMessage.text}</p>`;
            let timestamp = `<p class='timestamp'>${newMessage.timestamp}</p>`
            div = div + username + text + timestamp + "</div>"
            $('#messageContainer').append(div);
        });
    });
})