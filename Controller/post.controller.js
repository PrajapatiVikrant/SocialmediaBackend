import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";
import PostSchema from "../Model/PostSchema.js";
config();
import postSchema from "../Model/PostSchema.js";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const post = {
  Create: async (req, res) => {
    try {
      const { title } = req.query;
      const file = req.files.postImage;
      const upload = await cloudinary.uploader.upload(file.tempFilePath);
      const data = new postSchema({
        title: title,
        url: upload.url,
        postedBy: {
          id: req.user._id,
          name: req.user.name,
        },
      });
      await data.save();
      res.json({
        message: "image uploded",
      });
    } catch (err) {
      console.log('postcreatederror');
      res.json({
        message: "somthing went wrong",
      });
    }
  },
  Display: async (req, res) => {
    const { id } = req.user
    try{
        const data = await postSchema.find({'postedBy.id':id});
        res.json({
            message:data
        })
    }catch(err){
        res.json({
            message:"somthing went wrong"
        })
    }
  },
  displaysearch:async (req,res)=>{
      const { userId } = req.params;
      try {
        const data = await postSchema.find({'postedBy.id':userId});
        res.json({
            message:data
        })
      } catch (error) {
        res.json({
          message:"somthing went wrong"
      })
      }
  },
  Edit: async (req, res) => {
    const {url,title} = req.query;
    
    const {post_id} = req.params
   
    let updatedImage;

    if (req.files) {
      updatedImage = req.files.cardImage;
    }

    let uploadUpdatedImage = { url: url };
    try {
      if (updatedImage) {
        const arr = url.split("/");
        const lastItem = arr[arr.length - 1];
        const deleteImage = lastItem.split(".")[0];
        const deleteExistImage = await cloudinary.uploader.destroy(deleteImage);
        uploadUpdatedImage = await cloudinary.uploader.upload(
          updatedImage.tempFilePath
        );
      }
      
      await PostSchema.updateOne({_id:post_id},{
        url:uploadUpdatedImage.url,
        title:title
      });
      res.json({
        message:"Post Updated"
      })


    } catch (error) {
      console.log(error)
      res.json({
        message:"something error"
      })
    }
  },
  Remove: async (req, res) => {
    const {post_id} = req.params;
    const {post_url} = req.query;
    try {
      const arr = post_url.split('/');
      const lastItem = arr[arr.length-1];
      const deleteImage = lastItem.split('.')[0];
      await cloudinary.uploader.destroy(deleteImage)
      await PostSchema.deleteOne({_id:post_id})
      res.json({
        message:"Post deleted"
      })
    } catch (error) {
      
    }
  },
  Like: async (req, res) => {
    const {post_id} = req.params;
    const {name,_id} = req.user;
    try {
           await PostSchema.updateOne({_id:post_id},{
            $push:{
              like:{
                id:_id,
                name:name
              }
            }
          })
          return res.json({
            message:"updated"
          })
    } catch (error) {
      res.json({
        message:"somthing error"
      })
    }
  },
  Unlike: async (req, res) => {
    const {post_id} = req.params;
    const {name,_id} = req.user;
    try {
           await PostSchema.updateOne({_id:post_id},{
            $pull:{
              like:{
                id:_id,
                name:name
              }
            }
          })
          return res.json({
            message:"updated"
          })
    } catch (error) {
      res.json({
        message:"somthing error"
      })
    }
  },
  displayLikesUser: async (req, res) => {},
  Comment: async (req, res) => {
    const {post_id} = req.params;
    const {message} = req.query;
    const {_id,name} = req.user;
    try {
      
      const updatePost = await PostSchema.updateOne({_id:post_id},{
        $push:{
          comment:{
            id:_id,
            name:name,
            message:message
          }
        }
      })
     const updatedcomment = await PostSchema.findOne({_id:post_id});
      res.json({
        message:updatedcomment.comment
      })
    } catch (error) {
      console.log(error);
      res.json({
        message:'something error'
      })
    }
  },
  DisplayComment: async (req, res) => {
    const {post_id} = req.params;
    try {
      const data = await PostSchema.findOne({_id:post_id});
      res.json({
        post_id:post_id,
        message:data.comment
      })
    } catch (error) {
      console.log(error);
      res.json({
        message:'something error'
      })
    }
  },
  Uncomment: async (req, res) => {},
};
export default post;
