import { Router } from "express";
import message from "../Controller/message.controller.js";
import JWTverify from "../Middleware/JWTverify.js";
const route = Router();

route.get('/:user_id',JWTverify,message.getmessage)


export default route;