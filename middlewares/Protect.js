const jwt=require('jsonwebtoken')
const AppError=require('../utils/AppError')
const User =require('../models/user.model')
exports.protect=async(req,res,next)=>{
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            token=req.headers.authorization.split(" ")[1];
        }
        if(!token){
            return next(new AppError("You are not logged in! Please login to get access.",401))
        }
        const decoded=await jwt.verify(token,process.env.JWT_SECRET)
        const currentUser=await User.findById(decoded.id);
        if(!currentUser){
            return next( new AppError("The user belonging to this token does no longer exist.",401))
        }
        req.user=currentUser;
        next();
    } catch (err) {
        if(err.name === "JsonWebTokenError"){
            return next( new AppError("Invalid token. Please login again!",401));
        }
        if(err.name === "TokenExpiredError"){
           return next(
               new AppError("Your token has expired! Please login again",401)
           )
        }
      next(err);  
    }
};