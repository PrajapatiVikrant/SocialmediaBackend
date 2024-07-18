const express = require("express");
const { createServer } = require("http")
const { Server } = require("socket.io")
const jwt = require("jsonwebtoken")
const { config } = require("dotenv");
const mongoose = require("mongoose")
const db = require("./Config/db.js")
const app = require("./app.js");
const MessageSchema = require("./Model/MessageSchema.js");
const JWTverify = require("./Middleware/JWTverify.js");
const ProfileSchema = require("./Model/ProfileSchema.js");
config()

const server = createServer(app)
 const io = new Server(server,{
    cors:{
        origin: "https://green-nurse-xdrxl.pwskills.app:5173/message", 
        methods: ["GET", "POST"]
    }
})
io.on('connection',(socket)=>{
    console.log('user connected');
    socket.on('getdata',async(data)=>{
        console.log(data)
        const { user_id1,user_id2 } = data;
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
          socket.emit('messagearray',messagedata.messagebox)
    })
    socket.on('clearChat',async(data)=>{
      const {user_id1,user_id2} = data
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
        
        socket.emit('clearChat',{message:[]})
      } catch (error) {
        console.log(error)
      }
    })
    socket.on('sendMessage',(data)=>{
             const {user_id1,user_id2,token,message} = data;
             try{
             if(!token){
               socket.emit('sendResponse',{message:"Not login"})
             }else{
                jwt.verify(token,process.env.JWT_SECRET,async(err,decode)=>{
                  if(err){
                    socket.emit('sendResponse',{maessage:"Not login"})
                  }else{
                    const current_user = await ProfileSchema.findOne({_id:decode.id});
                    const current_username = current_user.name;
                    const current_id = current_user._id
                    console.log(current_id,current_username,message)
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
                    
                   const arr = [{name:'vikrant',id:1},{name:'ankur',id:2}]
                  const arr1 = arr.filter((elem)=>{
                    return elem.id !==1;
                   })
                   console.log(arr1)
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
                    socket.emit('sendResponse',{message:messagedata.messagebox})

                  }
                })
             }
            }catch(err){
              console.log(err)
            }
    })
    
    
    socket.on('disconnect',()=>{
      console.log('user disconnected')
    })
  })
const port = process.env.PORT_NO || 5000 ;
server.listen(port,async()=>{
    db();
    console.log(`server listen at https://black-chef-tktuc.pwskills.app:${port} `)
})