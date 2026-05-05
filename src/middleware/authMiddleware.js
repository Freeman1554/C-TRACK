import jwt, { decode } from 'jsonwebtoken';
import logger from '../utils/loggers.js';
import config from '../config/index.js';
import User from '../models/user.js';


const authMiddleware = async (req, res, next)=>{
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({success:false, message: "No token provided"});
    }

    const token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //const userId = decoded.userId || decoded.id
    if(!decoded.user_uuid){
        return res.status(400).json({success: false, message: "Invalid token payload: user_uuid missing"});
    }

    const user = await User.findOne({where:{user_uuid: decoded.user_uuid}});

        if(!user){
            return res.status(401).json({success: false, message:"User not authenticated"});
        };
        req.user = {
            user_uuid: user.user_uuid,
            username: user.username,
            role:user.role,
            email: user.email,
        };

    

        next();
    } catch(err){
        console.error("JWT verification failed:", err.message);
        res.status(401).json({success:false, message: 'Invalid token'});
    }
};



// export const authen = async (req, res, next) => {
//   try {
//     const token = req.headers.authorization?.split(" ")[1];
//     if (!token) return res.status(401).json({ message: "No token provided" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     if(!decoded.user_uuid){
//         return res.status(401).json({message:"Invalid token payload: user_uuid missing"});
//     }
//     const user = await User.findOne({ where: { user_uuid: decoded.user_uuid } });
//     if (!user) return res.status(401).json({ message: "User no longer exists" });

//     req.user = user; // attach logged-in user for use in adminOnly
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: "Invalid token", error: error.message });
//   }
// };

function verifyAuth(req, res, next){
    const token = req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({success: false, message:"No token provided"});
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {id: decoded.id};
        next();
    } catch(error){
        return res.status(401).json({success:false, message:"Invalid token"});
    }
}

const verifyAccountMiddleware = (req, res, next)=>{
    try{
        const token = req.cookies["token"];
        if(!token) {
            logger.warn("Access denial: Auth token not provided. Please Register");
            return res.status(401).json({success:false, message:"Access denial: Auth token not provided. Please Register"})
        };
        const decoded = jwt.verify(token, process.env.JWT_OTP_SECRET);
        req.user = decoded;
        next();
    } catch(error){
        logger.error(`JWT verification failed: ${error.message}`);
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({success: false, message:"Token expired."});
        };
        if(error.name === "JsonWebTokenError"){
            return res.status(403).json({success: false, message: "Invalid token."});
        };
        return res.status(500).json({success:false, message: "Authentication"});
    }
};

export {authMiddleware,verifyAccountMiddleware,verifyAuth}