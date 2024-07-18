import express from "express"
import mongoose from "mongoose"
import morgan from "morgan"
import fileUpload from "express-fileupload"
import db from "./Config/db.js"
import auth from "./Routes/Auth.route.js"
import post from "./Routes/Post.route.js"
import profile from "./Routes/Profile.route.js"
import message from "./Routes/Message.route.js"
import cors from "cors"
import avai from "./Controller/avai.js"

const app = express();


app.use(cors())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))
app.get('/',auth.auth)
app.use('/socialmedia/auth',auth);
app.use('/socialmedia/post',post)
app.use('/socialmedia/profile',profile);
app.use('/socialmedia/message',message);

export default app;