const moongose = require('mongoose');
const Schema = moongose.Schema;

const MessageSchema = new Schema({
    SenderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ReceiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Message: {
        type: String,
        required: true
    },


}, {timestamps: true});


module.exports = moongose.model('Message', MessageSchema);

    