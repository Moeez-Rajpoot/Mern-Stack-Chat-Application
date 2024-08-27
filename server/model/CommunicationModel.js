const moongose = require('mongoose');
const Schema = moongose.Schema;

const MessageSchema = new Schema({
    Participants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    Message: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Message',
            default: []
        }
    ]
});

module.exports = moongose.model('Conversation', MessageSchema);
    