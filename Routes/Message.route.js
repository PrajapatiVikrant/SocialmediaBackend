const { Router } = require("express");
const message = require("../Controller/message.controller.js");
const JWTverify = require("../Middleware/JWTverify.js");
const route = Router();

route.get('/:user_id',JWTverify,message.getmessage)
route.get('/:user_id1/:user_id2',message.getmessagecontinue);
route.delete('/:user_id1/:user_id2',message.clearChat);
route.post('/:user_id1/:user_id2',JWTverify,message.sendMessage);




module.exports = route;