const { Router } = require("express");
const auth = require("../Controller/auth.controller.js");
const JWTverify = require("../Middleware/JWTverify.js");



const route = Router();

route.post('/signup',auth.signup)
route.post('/login/:email/:password',auth.login)
route.post('/checklogin',JWTverify,auth.checklogin)

module.exports = route;