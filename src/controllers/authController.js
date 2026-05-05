import crypto from "crypto";
import AppError from "../utils/AppError.js";
import { changePassword,
    passwordReset,
    userRegistration,userSignIn,userSignOut, forgottonPassword
 } from "../services/userService.js";

import User from "../models/user.js";
import config from "../config/index.js";
//import { getOtp, getOtpExpiryTime } from "../utils/otpGen.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import {getOtp, getOtpExpiryTime} from "../utils/otpGen.js"
import logger from "../utils/loggers.js";
import emailServices from "../services/emailServices.js";
import { sendWelcomeEmail, sendSigninEmail, sendPasswordUrlEmail, 
  sendPassworResetConfirmEmail } from "../services/emailServices.js";


async function registerUser(req, res){
    try{
    const {username, email, password, phonenumber, role = 'user'} = req.body;
    
    //generate OTP
    const otp = getOtp();
    const otpExpires = getOtpExpiryTime(config.OTP_EXPIRY_TIME_MINS);

    // create user using service
    const newUser = await userRegistration({
        username, email, password, phonenumber, role: role ?? "user", otp, otpExpires
    })
    sendWelcomeEmail(newUser).catch(err =>
      console.error("Welcome email failed:", err)
    );

    res.status(201).json({
        Success: true,
        message:"User registered successfully",
        //otp,
        user:{
            username: newUser.username,
            email: newUser.email,
            phonenumber: newUser.phonenumber,
            role: newUser.role
        }
    })

    
    } catch (error){
        throw new AppError(error || "Registration Failed")
    }
};



async function signIn(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await userSignIn(email, password);

  
  await sendSigninEmail(user,{
    loginTime: new Date().toLocaleString(),
    location: req.ip,
    device: req.headers["user-agent"],
  })  

     res.status(200).json({
      message: "Login successfully",
      data: user,
    });

  } catch (error) {
    return next(new AppError(error.message || "Sign-in failed", 401));
  }
}
      
const changePasswordController = async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            Success:false,
            message: 'validation error',
            data: errors.array().map(e=>e.msg)
        });
    }
    try{
        if(!req.user || !req.user.id) {
            return res.status(401).json({
                Success:false,
                message:'User not authenticated'
            });
        }
        const {oldPassword, newPassword} = req.body;
        const userId = req.user.id;
        await changePassword(userId, oldPassword,newPassword);

        res.status(201).json({
            Success:true,
            message: 'Password changed successfully',
            user:{ id: req.user.id,
                username:req.user.username,
                role: req.user.role
            }
        });
        User
    } catch(error) {
        res.status(400).json({
            Success:false,
            message: error.message
        });
    }
}

async function forgotPassword(req, res, next){
  //console.log("REQ.BODY:", req.body);
  //console.log("REQ.HEADERS:", req.headers);
  try {
    const {email} = req.body;
    //console.log("EXTRACTED EMAIL:", email);
    if(!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
      
    }
    const {user, resetUrl} = await forgottonPassword(email);

    await sendPasswordUrlEmail(user, resetUrl);
    
    return res.status(200).json({
      success: true,
      message:"Password reset instruction sent",
    });
  } catch(error){
    next(error);
  }
    
};


export const logout = async (req, res) => {
  try {
    // call service
    const result = await userSignOut(req.user.user_uuid);

    // Express-specific: clear cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    // send response
    res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Reset password using OTP
async function resetPasswordController(req, res) {
    const {newPassword} = req.body;
    const {token} = req.params;
  
  try{
    const user = await passwordReset(token, newPassword);
    
    await sendPassworResetConfirmEmail(user);
    
    res.status(200).json({
      success: true,
      message: "Password reset successful",
      user:{
        email: user.email,
        username:user.username
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false, message: err.message
    });
  }
  
};



// // Verify OTP
// async function resendEmailverification (req, res) {
//   //  const errors = validationResult(req);
//   // if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array()[0].msg });
//   const { email } = req.body;
//   if(!email) return res.status(400).send("Email is required")

//   const user = await User.findOne({where: {email}  });
//   if (!user) return res.status(400).send("User not found");

//   //generate otp
//   const otp = getOtp();
//   const otpTimeMins = config.OTP_EXPIRY_TIME_MINS;
//   const otpTime = getOtpExpiryTime(otpTimeMins);

//   //save otp for email verification
//   user.otp = otp;
//   user.otpType = "email_verification";
//   user.otpTime = otpTime;
//   await user.save();

//   //send OTP email
//   try {
//     await emailService.sendOtp(user.email, "Your Email Verification OTP", user.username, otp, otpTimeMins);

//   } catch (err) {
//     throw new AppError(err.message, 500);
//   }
  
//   res.status(201).json({message: "Email verification OTP sent successfully"});


async function verifyEmail(req, res, next) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, otp } = req.body;

    // Lookup user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Validate OTP
    const otpExpired = new Date() > new Date(user.otpTime);

    if (
      user.otp !== otp ||
      user.otpType !== "email_verification" ||
      otpExpired
    ) {
      return res.status(400).send("Invalid or expired OTP");
    }

    // Mark email as verified
    user.emailVerified = true;
    user.otp = null;
    user.otpType = null;
    user.otpTime = null;
    await user.save();

    // Send welcome email
    try {
      await emailServices.sendWelcomeEmail(
        user.email,
        "Welcome to C-Track App!",
        user.username
      );
    } catch (error) {
      logger.error(error.message);
      throw new AppError(error.message, 500);
    }

    return res.status(200).send("Account verification was successful");

  } catch (error) {
    next(error); // Pass to global error handler
  }
}

// Send OTP
async function resendOtp(req, res) {
  const {email} = req.body;
  if (!email) return res.status(400).send("Email is required");

  const user = await User.findOne({where: {email}});
  if (!user) return res.status(401).send("You are not registered yet! Go to the sign up page!");

  const otp = getOtp();
  const otpTimeMins = config.OTP_EXPIRY_TIME_MINS;
  const otpTime = getOtpExpiryTime(otpTimeMins);

  user.otp = otp;
  user.otpType = "email_verification";
  user.otpTime = otpTime;
  await user.save();

  // Send OTP EMAIL
  try {
    await emailServices.sendOtp(user.email, "Your OTP Verification Code", user.username, otp, otpTimeMins);
  } catch (error) {
    logger.error(error.message);
    throw new AppError(error.message, 500);
  };

   res.status(201).json({ message: "OTP resent to your email" });
};

export {
    registerUser,
    changePasswordController,
    signIn, forgotPassword,
    resendOtp, resetPasswordController, verifyEmail
};