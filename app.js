const express =  require("express")
const mongoose = require("mongoose")
const morgan = require("morgan")
const fileUpload = require("express-fileupload")
require("./Config/db.js")

const cors = require("cors");

const app = express();


app.use(cors())
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))

app.use('/socialmedia/auth',require("./Routes/Auth.route.js"));
app.use('/socialmedia/post',require("./Routes/Post.route.js"))
app.use('/socialmedia/profile',require("./Routes/Profile.route.js"));
app.use('/socialmedia/message',require("./Routes/Message.route.js"));

module.exports = app;