import jwt from 'jsonwebtoken'
import User from '../Models/User.js';
const verifyuser = async(req,res,next) => {
    try{
        // Check if authorization header exists
        if(!req.headers.authorization){
            return res.status(401).json({success: false, error:"Authorization header not provided"})
        }

        const token = req.headers.authorization.split(' ')[1];
        if(!token){
            return res.status(401).json({success: false, error:"Token Not Provided"})
        }
        
        const JWT_KEY = process.env.JWT_KEY || "default_jwt_secret_key_for_development";
        const decoded = jwt.verify(token, JWT_KEY)
        if(!decoded){
            return res.status(401).json({success: false, error:"Token Not Valid"})
        }

        const user = await  User.findById({_id:decoded._id}).select('-password')

        if(!user){
          return res.status(401).json({success: false, error:"User not found"})
        }
        req.user=user
        next()

    }catch(error){
      console.error('Auth middleware error:', error);
      return res.status(401).json({success: false, error:"Authentication failed"})
    }
}
export default verifyuser