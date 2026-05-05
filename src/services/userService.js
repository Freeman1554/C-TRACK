import User from "../models/user.js";
import Utils from "../utils/Auth.js"
import cache from "../config/cache.js";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import crypto from "crypto";
import { isAdmin } from "../middleware/roleMiddleware.js";


async function userRegistration(userData){
    const {username, email, password, phonenumber, profilePicture, role} = userData;

    if(!username || !email || !password){
        throw new Error("Missing required fields");
    }

    const checkEmailExist = await User.findOne({where:{email:userData.email}});
    if(checkEmailExist){
        throw new Error("Email already exist")
    }

    const checkUsernameExist = await User.findOne({where: {username:userData.username}});
    if(checkUsernameExist){
        throw new Error("Username already exist")
    }

    const newUser = await User.create({
        username, email, password, phonenumber, profilePicture, role, otp: null, otpExpires: null, isVerified: false
    });
    return newUser
};

async function userSignIn(email, password){
        
    if (!email || !password) {
        throw new Error("Email and password are required");
    }
    
    
    const user = await User.findOne({where: {email}
    });
    
    if(!user) {
        console.log(`Login failed: User with email ${email} not found`);
        throw new Error("Invalid email or password");
    }
    
    
//check to see if password is valid
    const isPasswordMatch = await bcrypt.compare(password, user.password);
        //console.log("bcrypt result:", isPasswordMatch);

    if (!isPasswordMatch) {
        //console.log("Password mismatch:");
        throw new Error ("Invalid email or password")
    }

   //Manual way to bring in your jsonwebtoken
    const token = await Utils.generatetoken(user);
    const refreshToken = await Utils.generateRefreshToken(user, token);
    return{
        user_uuid: user.user_uuid,
        email: user.email, username: user.username, phone: user.phonenumber || null,
        profilePicture: user.profilePicture || null, 
        role: user.role, token, refreshToken,
    }
}


export const userSignOut = async (userUUID) => {
  // clear session in DB, remove tokens, etc.
  return { message: "Logged Out successfully", userUUID };
};


async function refreshUserToken(refreshToken){
    const decoded = await Utils.verifyRefreshToken(refreshToken)
    const user = await User.findOne({where: {user_uuid: decoded.user_uuid}});
    if(!user) throw new Error("User not found")

        const newToken = await Utils.generatetoken(user);
        const newRefreshToken = await Utils.generateRefreshToken(user, newToken)
    return{
        token: newToken,
        refreshToken: newRefreshToken,
    }
};

const forgottonPassword = async (email) => {
  
    if (!email || typeof email !=="string") {
      throw new Error ("Email is required and must be a string" );
    }
    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ where: { email: normalizedEmail } });
    if (!user) {
      throw new Error ("User not found" );
    }

    // Generate OTP
    //const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    //const otpExpires = new Date(Date.now() + 10 * 60 * 1000) // valid for 10 minutes

    //Generate link token
    const token = crypto.randomBytes(32).toString("hex");

    //user.resetOtp = otp;
    //user.resetExpire = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = token
    user.resetPasswordExpires = new Date (Date.now() + 15 * 60 * 1000);

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
    
    return {
        user,
        //otp,
        resetUrl
    };
    
    // await user.update({
    //     otp,
    //     otpExpires,
    // });


    // Here you would send OTP via email/SMS
    // sendOtpEmail(user.email, otp);
};

const passwordReset = async (token, newPassword)=>{
    if(!token || typeof token !== "string") {throw new Error("Reset token is required")};

    token = token.trim();
    
    if(!newPassword){
        throw new Error("New password required")
    }
    //console.log("Token from URL:", token);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    //console.log("Hashed token for DB lookup:", hashedToken);

    const user = await User.findOne({where:{
        resetPasswordToken: token,
        resetPasswordExpires:{[Op.gt]: new Date()}
 }
});
    console.log("Found user:", user)

    if(!user) throw new Error("Invalid or expired reset token")

    //if(!user.otp || user.otp.toString() !==otp.toString() || !user.otpExpires || user.otpExpires < new Date())
        //throw new Error("Invalid or expired OTP")
    //const hashed = await bcrypt.hash(newPassword, 10);

    user.password = newPassword;

    //Clear OTP and reset token
    //user.otp = null;
    //user.otpExpires = null;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();
    return user;
};

const changePassword = async(userId, oldPassword, newPassword) =>{
    console.log("Looking for user with ID", userId)
    const user =  await User.findOne({where:{user_uuid: userId}});
    console.log("User fetched:", user)
    if(!user) throw new Error("user not found")

//check old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if(!isMatch) throw new Error("Old password is incorrect");

//Hash and save new password
    const hashedNew = await bcrypt.hash(newPassword, 10);
    user.password = hashedNew;
    await user.save();
    //console.log(await User.findAll({where:{id:'458916b5-82a1-444c-b007-70d6f85a51b4'}}));
    return {message:"password changed successfully"};
};   



export {userRegistration,userSignIn,
    refreshUserToken,forgottonPassword, passwordReset, changePassword
};
