import jwt from 'jsonwebtoken'
import User from '../Models/User.js';
const verifyuser = async(req,res,next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(404).json({success: false, error:"Token Not Provided"})
        }
        const decoded = jwt.verify(token,process.env.JWT_KEY)
        if(!decoded){
            return res.status(404).json({success: false, error:"Token Not Valid"})
        }


        const user = await  User.findById({_id:decoded._id}).select('-password')

        if(!user){
          return res.status(404).json({success: false, error:"User not found"})
        }
        req.user=user
        next()


    }catch(error){
      return res.status(500).json({success: false, error:"server error"})

    }
}
export default verifyuser