const mongoose = require("mongoose");
const { Schema, model } = require("mongoose")

const message = new Schema({
  user1: {
    id: {
      type: mongoose.Schema.ObjectId,
      ref: "SocialmediaProfile",
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
  },
  user2: {
    id: {
      type: mongoose.Schema.ObjectId,
      ref: "SocialmediaProfile",
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
  },
  messagebox: [
    {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: "SocialmediaProfile",
      },
      name: {
        type: String,
        required: [true, "name is required"],
      },
      message: {
        created: {
          type:Date,
          default:Date.now
        },
        message_text:{
            type:String,
            required:[true,"message text is required"]
        }
      },
    },
  ],
});
const MessageSchema = model("SocialmediaMessage", message);
module.exports = MessageSchema;
