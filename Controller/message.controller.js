const MessageSchema = require("../Model/MessageSchema.js");



const message = {
  getmessage: async (req, res) => {
    const {user_id} = req.params;
    const {_id} = req.user;
    try {
         const data = await MessageSchema.findOne({
          $or:[
            {
              'user1.id':user_id,
              'user2.id':_id
            },
            {
              'user1.id':_id,
              'user2.id':user_id
            }
        ]
        })
        if(data){
          return res.json({
            user1:data.user1.id,
            user2:data.user2.id,
            data:data.messagebox
          })
        }
        return res.json({
          message:"Please connect first"
        })
    } catch (error) {
      res.json({
        message:"Something error"
      })
    }
    
  },
};
module.exports =  message;
