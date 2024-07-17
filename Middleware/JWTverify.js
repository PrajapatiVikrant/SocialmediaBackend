import { config } from "dotenv"
config()
import ProfileSchema from "../Model/ProfileSchema.js"
import jwt from 'jsonwebtoken'


const JWTverify = async(req,res,next)=>{
    try {
     
        const token = req.query.token

        if (!token) {
           res.json({
            message:'Not login'
           })
        } else {
          jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
             
              res.json({
                message:'Not login'
              });
            } else {
              let mydata = await ProfileSchema.findOne({ email: decoded.email });
              req.user = mydata;
              next();
            }
          });
        }
      
    } catch (error) {
        console.log(error);
        res.json({
            message:'server error'
        })
    }

}
export default JWTverify;