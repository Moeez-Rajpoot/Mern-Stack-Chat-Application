const asyncHandler = require('express-async-handler');
const Message = require('../model/MessageModel'); 
const Conversation = require('../model/CommunicationModel');

const SendMessage = asyncHandler(async (req, res) => {
    const SenderId = req.user.id;
    const ReceiverId = req.params.id;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message content is required' });
    }

    try {
        let conversation = await Conversation.findOne({
            Participants: {
                $all: [SenderId, ReceiverId]
            }
        });

        if (!conversation) {
            conversation = await Conversation.create({
                Participants: [SenderId, ReceiverId]
            });
        }

        const newMessage = new Message({
            SenderId,
            ReceiverId,
            Message: message
        });

        await newMessage.save();

        if (newMessage) {
            conversation.Message.push(newMessage._id);
        }

        await conversation.save();

        res.status(201).json({ message: 'Message sent successfully', newMessage });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error sending message' });
    }
});

const GetMessage = asyncHandler(async (req, res) => {
  const SenderId = req.user.id;
  const ReceiverId = req.params.id;
  try {

    let conversation = await Conversation.findOne({
        Participants:{
            $all: [SenderId , ReceiverId]
        }
    }).populate('Message');

    if(!conversation){
        return res.status(404).json({error: 'No conversation found'});
    }

    res.status(200).json(conversation.Message);
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error sending message' });
  }
});

module.exports = { SendMessage ,GetMessage };