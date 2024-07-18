const mongoose = require("mongoose");
const { config } = require("dotenv")
config()
mongoose.connect(process.env.MONGOOSE_URL);