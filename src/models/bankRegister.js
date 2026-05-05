import sequelize from "../config/database.js";
import { DataTypes } from 'sequelize';

const BankRegister = sequelize.define(
    "BankRegister",
    {
        bankid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
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
        }
    },
    {
        timestamps: true
    }
)

export default BankRegister;