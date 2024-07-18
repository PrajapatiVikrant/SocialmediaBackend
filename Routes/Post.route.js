const { Router } = require("express");
const post = require("../Controller/post.controller.js");
const JWTverify = require("../Middleware/JWTverify.js");
const route = Router();

route.post('/create',JWTverify,post.Create)
route.get('/read',JWTverify,post.Display)
route.get('/read/:userId',post.displaysearch)
route.put('/update/:post_id',post.Edit)
route.delete('/delete/:post_id',post.Remove)
route.get('/showlikes',post.displayLikesUser);
route.post('/like/:post_id',JWTverify,post.Like);
route.post('/unlike/:post_id',JWTverify,post.Unlike);
route.get('/showcomments/:post_id',post.DisplayComment);
route.post('/comment/:post_id',JWTverify,post.Comment);
route.post('/uncomment',JWTverify,post.Uncomment);

module.exports = route;