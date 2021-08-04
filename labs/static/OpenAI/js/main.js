$(document).ready(() => {
    initChatEvents();
});

/**
 * Generates the necessary events to interact with OpenAI 
 * These events are assigned to the DOM
 */
const initChatEvents = () => {
    $('#input-openai').val("")
    $('#input-openai').keydown(function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {
            createUserMsg();
        } else {
            $('#ho-is').html("You is writing...");
            setTimeout(() => { $('#ho-is').html(""); }, 1500)
        }
    })
    $('#send-msg').click(createUserMsg);
}

/**
 * Generate the html to display in the interface 
 * @param {*} user 
 * @param {*} msg 
 * @param {*} error 
 * @returns 
 */
const generateIntefaceMsg = (user, msg, error = false) => {
    let html = "";
    switch (user) {
        case 'you':
            html += '<div class="d-flex align-items-center text-right justify-content-end ">';
            html += '<div class="pr-2"> <span class="name">You</span>';
            html += `<p class="msg">${msg}</p>`;
            html += '</div>';
            html += `<div><img  src="${user_avatar}" width="30" class="img1" /></div>`;
            break
        case 'openai':
            html += '<div class="d-flex align-items-center">'
            html += `<div class="text-left pr-1"><img src="${openai_avatar}" width="30" class="img1" /></div>`
            html += '<div class="pr-2 pl-1"> <span class="name">OpenAI</span>';
            let errorClass = (error) ? "bg-warning": "";
            html +=`<p class="msg ${errorClass}">${msg}</p>`;
            html += '</div>';
            html += '</div>';
            break;
    }
    return html;
}

/**
 * Displays the user's text in the chat once entered. 
 */
const createUserMsg = () => {
    let input = $('#input-openai');
    let msg = $(input).val();

    if (msg && (/^(\s)*$/.test(msg) === false)) {
        let html = generateIntefaceMsg("you", msg)
        $(input).val("");
        let msgContainer = $('#messages-container')
        $(msgContainer).append(html)
        $(msgContainer).animate({ scrollTop: $(msgContainer).height() }, 'fast');
        sendMsg(msg)
    }
}


/**
 * Send a message to the Django api 
 * @param {*} msg 
 */
const sendMsg = msg => {
    $('#ho-is').html("OpenAI is thinking...");
    $.get("OpenAI/operate/msg", { msg: msg }, data => {
        let msgContainer = $('#messages-container')
        let txtMsg = "An error has occurred, you may not have set the API key in the settings.py file ☠";
        let isError = ("error" in data)
        if(!isError){
            txtMsg = data.choices[0]['text']
        }
        let msg = generateIntefaceMsg("openai", txtMsg, isError);
        $(msgContainer).append(msg)
        $('#ho-is').html("");
        $(msgContainer).animate({ scrollTop: $(msgContainer).height() }, 'fast');
    });
}