const { Router } = require("express");
const message = require("../Controller/message.controller.js");
const JWTverify = require("../Middleware/JWTverify.js");
const route = Router();

route.get('/:user_id',JWTverify,message.getmessage)


module.exports = route;