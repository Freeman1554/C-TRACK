import sequelize from "../config/database.js";
import { DataTypes, UUIDV4 } from "sequelize";

const Delivery = sequelize.define(
    "Delivery",
    {
        bankid: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
        },

        bank: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        branchname: {
            type: DataTypes.STRING,
            allowNull: false,
            unique:false,
        },
        
        branchaddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        localgovt:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        state:{
            type: DataTypes.STRING,
            unique: false,
        },
        chipsdelivered:{
            type: DataTypes.INTEGER,
        },
        receivedby:{
            type: DataTypes.STRING,
            allowNull:false,
            //unique:false
        },
        receipt:{
            type: DataTypes.STRING,
            allowNull: true,
            //unique:true,
            defaultValue:"default-avatar.png"
        },
        remarks:{
            type: DataTypes.STRING,
            allowNull:true
        }
    },
    {
        timestamps: true
    }
    
)
export default Delivery;