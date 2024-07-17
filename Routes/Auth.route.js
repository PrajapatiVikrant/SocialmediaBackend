import { Router } from "express";
import auth from "../Controller/auth.controller.js";
import JWTverify from "../Middleware/JWTverify.js";



const route = Router();

route.post('/signup',auth.signup)
route.post('/login/:email/:password',auth.login)
route.post('/checklogin',JWTverify,auth.checklogin)

export default route;