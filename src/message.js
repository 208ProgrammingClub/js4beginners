var messageContent = null;
var previousContent = null;

// current
messageContent = null;
showMessage = false;
///////////

if (showMessage){
    if (!messageShowing || (previousContent != messageContent) ){
        if (!messageContent){
            messageContent = 'Attention Please!<p style="font-size: 22px;">';
        }
        
        closeMessage();
        
        var msgHtml = '<div id="message" style="background-color: lightcoral; position absolute; top:0px; left:0px; width: 444px; height: 666px; z-index:10000; font-size: 77px; border: 1px solid gray; display: none;">'+ messageContent +'</p></div>';
        var msg = htmlToElement(msgHtml);
        
        addEl(msg);
        
        $( msg ).dialog({
            left: 10,
            height: 500,
            width: 550,
            dialogClass: "no-close-alert",
            modal: true,
            draggable: false
        });
        
        // hide close button
        $('div.no-close-alert').find('button.ui-dialog-titlebar-close').css('display', 'none');
        
        // less padding
        $('.ui-dialog .ui-dialog-content').css('padding', '20px');
        
        
        messageShowing = true;
        previousContent = messageContent;
    }
}
else{
    closeMessage();
}

function closeMessage(){
    var node = el('message');
    if (node){
        $(node).dialog('close');
        node.parentNode.removeChild(node);
        messageShowing = false;
    }
}
cleanUpMessageScript();