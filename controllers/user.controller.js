const jwt=require('jsonwebtoken');
const User=require('../models/user.model');
const AppError=require('../utils/AppError');

// function for provide token
const signToken=(id)=>{
  return jwt.sign({id},process.env.JWT_SECRET,{
      expiresIn:process.env.JWT_EXPIRES_IN,
  });
}

// function to give response
const createSendToken=(user,statusCode,req,res)=>{
    const token=signToken(user._id);
    user.password=undefined;
    user.__v=undefined;
    res.status(statusCode).json({
        status:"Success",
        token,
        data:{
            user,
        }
    });
};

// controller func for login
exports.signup=async(req,res,next)=>{
try {
  const {name,email,password,role,number}  = req.body;
  const newUser=await User.create({
     name,
      email,
      password,
      role,
      number,
  });
  createSendToken(newUser,201,req,res);
  }catch (err) {
    if(err.code && err.code == 11000){
        return next(new AppError("Email or number is already exist!",400));
    }
    next(err);
  }  
}

// controller func for login
exports.login=async(req,res,next)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            return next(new AppError("Please provide email and password!",400));
        }
        const user=await User.findOne({email}).select("+password");
        if(!user || !user.password || !(await user.correctPassword(password,user.password))){
            return next(new AppError("Incorrect email or password",401));
        }
        createSendToken(user,200,req,res);
    } catch (error) {
        next(error)
    }
}