const express = require("express");
const dotenv = require("dotenv").config();
const Router = express.Router();
const AuthorizeToken = require("../middleware/AuthorizeToken");
const Message = require("../controller/messageController");

Router.post("/sendmessage/:id",AuthorizeToken,Message.SendMessage);
Router.get("/getmessage/:id",AuthorizeToken,Message.GetMessage);
// Router.get("/getconversation",AuthorizeToken,Message.GetConversation);



module.exports = Router;
