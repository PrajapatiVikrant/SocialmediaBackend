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
  getmessagecontinue:async(req,res)=>{
   
    const { user_id1,user_id2 } = req.params;
    try {
      const messagedata = await MessageSchema.findOne({
        $or:[
          {
            'user1.id':user_id1,
            'user2.id':user_id2
          },
          {
            'user1.id':user_id2,
            'user2.id':user_id1
          }
      ]
      })
      res.json(messagedata.messagebox);
    } catch (error) {
      res.json({
        message:"somthing error"
      })
    }
       
  },

  clearChat:async(req,res)=>{
    const {user_id1,user_id2} = req.params;
   
    try {
      const emptyarr = [];
      const messagedata = await MessageSchema.findOneAndUpdate({
        $or:[
          {
            'user1.id':user_id1,
            'user2.id':user_id2
          },
          {
            'user1.id':user_id2,
            'user2.id':user_id1
          }
      ]
      },
      {
        messagebox:emptyarr
      }
      )
      
      
      res.json({
        message:[]
      })
    } catch (error) {
      console.log(error)
    }
  },
  sendMessage:async(req,res)=>{
    const {user_id1,user_id2} = req.params;
    const {_id,name} = req.user;
    const {message} = req.query;
    try{
    
           const current_user = await ProfileSchema.findOne({_id:_id});
           const current_username = current_user.name;
           const current_id = current_user._id
           const messagedata = await MessageSchema.findOne(
             {
               $or: [
                 {
                   'user1.id': user_id1,
                   'user2.id': user_id2
                 },
                 {
                   'user1.id': user_id2,
                   'user2.id': user_id1
                 }
               ]
             }
           );
           messagedata.messagebox.push({
             id:current_id,
             name:current_username,
             message:{
               message_text:message
             }
           })
           const updateMessageData = await MessageSchema.updateOne(
             {
               $or: [
                 {
                   'user1.id': user_id1,
                   'user2.id': user_id2
                 },
                 {
                   'user1.id': user_id2,
                   'user2.id': user_id1
                 }
               ]
             },
             {
               messagebox:messagedata.messagebox
             }
           );
           const user1_connection = await ProfileSchema.findOne({_id:user_id1});
           const user2_connection = await ProfileSchema.findOne({_id:user_id2});
           
          
           //update  user1 connection
           user1_connection.connection = user1_connection.connection.filter((elem,ind)=>{
             return elem.id != user_id2
       })
           user1_connection.connection.unshift({
             id:user_id2,
             name:user2_connection.name
           })
           
          
           //update user2 connection
           user2_connection.connection =  user2_connection.connection.filter((elem)=>{
               console.log(elem.id+"=="+user_id1)
               return elem.id != user_id1
         })
         
           user2_connection.connection.unshift({
             id:user_id1,
             name:user1_connection.name
           })


           //update user1 connection in database
           const update_connection1 = await ProfileSchema.updateOne(
             {
               _id:user1_connection._id
             },
             {
               connection:user1_connection.connection
             }
           )
           console.log(update_connection1)
           //update user2 connection in database
           const update_connection2 = await ProfileSchema.updateOne(
             {
               _id:user2_connection._id
             },
             {
               connection:user2_connection.connection
             }
           )
           console.log(update_connection2)
           
           res.json({
            message:messagedata.messagebox
           })

         
    
    
   }catch(err){
     console.log(err)
   }
  }
};
module.exports =  message;
