const cloudinary  =  require("cloudinary").v2;
const MessageSchema = require("../Model/MessageSchema.js");
const ProfileSchema = require("../Model/ProfileSchema.js");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const profile = {
  getProfile: async (req, res) => {
    try {
      res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        title: req.user.title,
        url: req.user.url,
        follower: req.user.follower,
        following: req.user.following,
        connection: req.user.connection,
        request: req.user.request,
        invitation: req.user.invitation,
      });
    } catch (error) {
      console.log(error)
      res.json({
        message:'somthin wrong'
      })
    }
    
  },
  showOtherProfile: async (req, res) => {
    console.log(req.params);
    const { email } = req.params;
    try {
      const data = await ProfileSchema.findOne({ email: email });
      if (data) {
        return res.json({
          id: data._id,
          name: data.name,
          email: data.email,
          title: data.title,
          url: data.url,
          follower: data.follower,
          connection: data.connection,
        });
      } else {
        res.send("Not found");
      }
    } catch (error) {
      console.log(error);
    }
  },
  showProfileByid: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await ProfileSchema.findOne({ _id: id });
      res.json({
        id: data._id,
        name: data.name,
        email: data.email,
        title: data.title,
        url: data.url,
        follower: data.follower,
        connection: data.connection,
      });
    } catch (error) {
      console.log("showProfileByid");
    }
  },
  editProfile: async (req, res) => {
    const { url, title } = req.query;
    const { user_id } = req.params;
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
      await ProfileSchema.updateOne(
        { _id: user_id },
        {
          url: uploadUpdatedImage.url,
          title: title,
        }
      );
      res.json({
        message: "Profile Updated",
      });
    } catch (error) {
      console.log(error);
      res.json({
        message: "something error",
      });
    }
  },
  sendConnectionReq: async (req, res) => {
    const { user_id } = req.params;
    try {
      const data = await ProfileSchema.findOne({ _id: user_id });
      await ProfileSchema.updateOne(
        { _id: user_id },
        {
          $push: {
            request: {
              id: req.user._id,
              name: req.user.name,
            },
          },
        }
      );
      await ProfileSchema.updateOne(
        { _id: req.user._id },
        {
          $push: {
            invitation: {
              id: user_id,
              name: data.name,
            },
          },
        }
      );

      res.json({
        message: "connecting",
      });
    } catch (error) {
      console.log("sendConnectionReq");
    }
  },
  checkConnectionStatus: async (req, res) => {
    const { user_id } = req.params;
    const { _id } = req.user;
    try {
      const invitation = await ProfileSchema.findOne({
        _id: _id,
        "invitation.id": user_id,
      });
      if (invitation) {
        return res.json({
          message: "Connecting",
        });
      } else {
        const connection1 = await MessageSchema.findOne({
          "user1.id": user_id,
          "user2.id": _id,
        });
        const connection2 = await MessageSchema.findOne({
          "user1.id": _id,
          "user2.id": user_id,
        });
        if (connection1 || connection2) {
          return res.json({
            message: "Connected",
          });
        }
        return res.json({
          message: "Connect",
        });
      }
    } catch (error) {
      console.log(error);
      console.log("checkConnectionStatus");
    }
  },
  CreateConnection: async (req, res) => {
    const { user_id, user_name } = req.params;
    const { _id, name } = req.user;

    try {
      const data = new MessageSchema({
        user1: {
          id: _id,
          name: name,
        },
        user2: {
          id: user_id,
          name: user_name,
        },
      });
      await data.save();
      console.log("message data save successfully");
      await ProfileSchema.updateOne(
        { _id: _id },
        {
          $push: {
            connection: {
              id: user_id,
              name: user_name,
            },
          },
        }
      );
      console.log("create connection successfully1");
      await ProfileSchema.updateOne(
        { _id: user_id },
        {
          $push: {
            connection: {
              id: _id,
              name: name,
            },
          },
        }
      );
      console.log("create connection successfully1");
      await ProfileSchema.updateOne(
        { _id: _id },
        {
          $pull: {
            request: {
              id: user_id,
              name: user_name,
            },
          },
        }
      );
      console.log("delete request successfully1");
      await ProfileSchema.updateOne(
        { _id: user_id },
        {
          $pull: {
            invitation: {
              id: _id,
              name: name,
            },
          },
        }
      );
      console.log("delete invitation successfully1");
      return res.json({
        message: "Connection created",
      });
    } catch (error) {
      console.log("CreateConnection");
      console.log(error);
      res.json({
        message: "somthing went wrong",
      });
    }
  },
  ShowConnection: async (req, res) => {},
};
module.exports = profile;
