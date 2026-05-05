import sequelize from "../config/database.js";
import { DataTypes, ENUM, STRING, UUIDV4 } from "sequelize";
import bcrypt from "bcryptjs";


const User = sequelize.define(
    "User",
    {
        user_uuid:{type: DataTypes.UUID, defaultValue:UUIDV4, primaryKey: true, field: "user_uuid"},
        username: {type: DataTypes.STRING, allowNull:false, unique: false},
        email: {type: DataTypes.STRING, allowNull:false, unique:false},
        password: {type: DataTypes.STRING, allowNull:false, unique:false},
        phonenumber: {type: DataTypes.STRING, allowNull:false, unique:false},
        profilePicture: {type:DataTypes.STRING, allowNull:false, defaultValue:'user'},
        role: {type: DataTypes.ENUM("user", "admin"), allowNull:false, defaultValue:'user'},
        otp: {type:DataTypes.STRING, allowNull: true},
        otpType: {type: DataTypes.STRING, allowNull: true}, //"email_verification" || "password_reset"
        otpExpires: {type: DataTypes.DATE, allowNull:true},
        isVerified: {type: DataTypes.BOOLEAN, defaultValue:false},
        resetPasswordToken:{type: DataTypes.STRING},
        resetPasswordExpires:{type: DataTypes.DATE},
        resetOtp:{type: DataTypes.STRING}, 
        resetOtpExpire:{type: DataTypes.DATE}
    }, { timestamps: true,
        hooks: {
            beforeCreate:async (user)=>{
                user.username = user.username.toLowerCase();
                user.email = user.email.toLowerCase();
                if(user.password){
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt)
                }
            },
            beforeUpdate: async(user)=>{
                if(user.changed("username")){
                    user.username = user.username.toLowerCase();
                }
                if(user.changed ("email")){
                    user.email = user.email.toLowerCase();
                }
            //hash only if password change
                if(user.changed("password")) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt)
                }
            }
        },
        // indexes:[
        //     {
        //         unique:true,
        //         fields:["user_uuid"],
        //     },
        //     {
        //         unique:true,
        //         fields:["username"],
        //     },
        //     {
        //         unique:true,
        //         fields:["email"]
        //     },
        // ]
    }
);
User.prototype.verifyPassword = async function(password){
    return await bcrypt.compare(password, this.password)
};

export default User;