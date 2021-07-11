const mongoose = require('mongoose');

const conversationSchema = mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    fromUser: {
        type: String,
        required: true
    },
    toUser: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;