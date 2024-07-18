const mongoose = require("mongoose");
const { Schema, model } = require("mongoose")

const Post = new Schema({
  title: {
    type: String,
    required: [true, "title is required"],
  },
  url: {
    type: String,
    required: [true, "url is required"],
  },
  postedBy: {
    id: {
      type: mongoose.Schema.ObjectId,
      ref: "SocialmediaProfile",
    },
    name: {
      type: String,
      required: [true, "name is required"],
    },
  },
  like: [
    {
      id: {
        type: mongoose.Schema.ObjectId,
        ref: "SocialmediaProfile",
      },
      name: {
        type: String,
        required: [true, "name is required"],
      },
    },
  ],
  comment: [
    {
      id:{
        type: mongoose.Schema.ObjectId,
        ref: "SocialmediaProfile",
      },
      name:{
        type:String,
        required:[true,"name is required field"]
      },
      message:{
        type:String,
        required:[true,"message is required field"]
      }
    }
  ]
    
});
const PostSchema = model("SocialmediaPost", Post);
module.exports = PostSchema;
