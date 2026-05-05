import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import User from '../models/user.js';

async function generatetoken(user) {
    try{
        const payload = {user_uuid: user.user_uuid, username: user.username, role: user.role}
        return jwt.sign(payload,config.JWT_SECRET, {
            expiresIn: config.JWT_REFRESH_EXPIRES_IN,
        })
    } catch(error){
        throw new Error("Error generating Token")
    }
    
}
async function verifytoken(token){
    try{
        return jwt.verify(token, config.JWT_SECRET);
    } catch(error){
        throw new Error("invalid Token")
    }
};

async function generateRefreshToken(user, token){
    try{
        const payload = {user_uuid: user.user_uuid, username: user.username, role: user.role, tokenid:token}
        return jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: config.JWT_REFRESH_EXPIRES_IN,
        })
    } catch(error){
        throw new Error("Error generating Refresh Token")
    }
}

async function verifyRefreshToken(token){
    try{
        return jwt.verify(token, config.JWT_SECRET);
    } catch(error){
        throw new Error("Invalide Refresh Token")
    }
};

const resendOtpService = async (id, Option, otpTime)=>{
    const user = await user.findByPk(id);
    if(!user) return null;
    user.otp = otp;
    user.otpTime = otpTime;

    await user.save();
    return user;
}

const verifyUser = async (email, otp)=>{
    const user = await User.findOne({where:{email}});
    if(!user || !user.otp || user.otp !==otp || !user.otpTime || user.otpTime<new Date()) return null;
    user.verified = true;
    user.otp = null;
    user.otptime = null;
    await user.save();
    return user;
};

export default{generatetoken,verifytoken,generateRefreshToken,
    verifyRefreshToken,resendOtpService,verifyUser

};