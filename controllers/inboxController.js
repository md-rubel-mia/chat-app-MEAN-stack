const Inbox = require('../models/Conversation');

async function storeMessage(req, res, next) {
    const message = new Inbox({
        ...req.body
    })
    try{
        global.io.emit("new_message", {
            message: message.message,
            fromUser: message.fromUser,
            toUser: message.toUser
        })
        message.save();
        res.status(200).json({
            message: "message has been sent successfully"
        })
    }
    catch(err) {
        res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function getMessage(req, res, next){
    try{
        const messages = await Inbox.find().or([{"fromUser": req.body.fromUser, "toUser": req.body.toUser},
        { "fromUser": req.body.toUser, "toUser": req.body.fromUser }]);

        // global.io.emit("new_message", {
        //     message: messages
        // })

        if(messages) {
            res.status(200).json({messages});
        } else{
            res.status(500).json({
                message: "Internal server error"
            })
        }
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            messages: "Internal server error"
        })
    }
}

module.exports = {storeMessage, getMessage};