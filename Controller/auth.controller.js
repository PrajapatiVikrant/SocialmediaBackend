const ProfileSchema = require("../Model/ProfileSchema.js");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

// const auth = {
//   signup: async (req, res) => {
//     console.log('game has started')
//     const {name,email,password,title} = req.query;
//      try{
//           const user = await ProfileSchema.findOne({email:email});
//           if(user){
//            return res.json({
//               message:'user already exist'
//             })
//           }
//           const hashPassword = await bcrypt.hash(password,10);
//           const data  = new ProfileSchema({
//             name:name,
//             email:email,
//             title:title,
//             password:hashPassword 
//           })
//           await data.save();
//           return res.json({
//             message:'Signup successfully',
//           })
//      }catch(error){
//       console.log('signup')
//       res.json({
//         message:'server error'
//       })
//      }
//   },
//   login: async (req, res) => {
//     const {email,password} = req.params;
//     try {
//       const data = await ProfileSchema.findOne({email:email});
//       if(!data){
//         return res.json({
//           message:'You are not exist register now'
//         })
//       }
//       const passwordmatch = await bcrypt.compare(password,data.password);
//       if(passwordmatch){
       
//         const token =  jwt.sign(
//           { email: email,id:data._id},
//           process.env.JWT_SECRET,
//           { expiresIn: "60m" }
//           );
//          return res.json({
//           id:data._id,
//           message:'Login successfully',
//           token:token
//         })
//       }
//       return res.json({
//         message:'Invalid detail'
//       })
      
//     } catch (error) {
//       console.log('login')
//       res.json({
//         message:'server error'
//       })
//     }
//   },
//   checklogin: (req,res)=>{
//    return res.json({
//     message:true
//    })
//   }
// };
const auth = {
  login: async (req, res) => {
         const {email,password} = req.params;
        try {
         //const data = await ProfileSchema.findOne({email:email});
          // if(!data){
          //   return res.json({
          //     message:'You are not exist register now'
          //   })
          // }
        //   const passwordmatch = await bcrypt.compare(password,data.password);
        //   if(passwordmatch){
           
        //     const token =  jwt.sign(
        //       { email: email,id:data._id},
        //       process.env.JWT_SECRET,
        //       { expiresIn: "60m" }
        //       );
        //      return res.json({
        //       id:data._id,
        //       message:'Login successfully',
        //       token:token
        //     })
        //   }
        //   return res.json({
        //     message:'Invalid detail'
        //   })
        res.json({
          message:"hello world 4"
        })
          
        } catch (error) {
          console.log('login')
          res.json({
            message:'server error'
          })
        }
        
      },
}
 module.exports = auth;
