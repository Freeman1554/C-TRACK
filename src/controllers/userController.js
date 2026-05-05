import User from "../models/user.js";



export const adminOnly = (req, res, next) => {
  try {
    // user should be attached to req.user by your auth middleware (JWT)
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user provided" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admins only" });
    }

    next(); // allow access
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { user_uuid } = req.params;

    const user = await User.findOne({ where: { user_uuid } });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.destroy();

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete User Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


export async function getUserProfile(req, res, next){
  try{
    const userUUID = req.user.user_uuid;
    if(!userUUID){
      return res.status(400).json({
        success: false,
        message: "User UUID missing from request",
      });
    }

    if(cache){
        const cachedProfile = await cache.get(`userProfile:${userUUID}`);
        if(cachedProfile){
            return JSON.parse(cachedProfile)
        }
    }
    const user = await User.findOne({where: {user_uuid: userUUID},
    attributes: {exclude:["password"]},
  })
    if(!user) 
      return res.status(404).json ({message:"User not found"});
    const userData = user.get({plain: true});
    delete userData.password//before sending user profile to frontend, ensure you delete thier password
    
    if(cache){
        await cache.set(`userProfile:${userUUID}`, JSON.stringify(userData),{EX:3600} );
    }
    return res.json (userData);
  } catch(err){
    next(err)
  }

}