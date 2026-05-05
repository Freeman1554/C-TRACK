import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";


const RequestOrder = sequelize.define(
    "RequestOrder",
    {
        bank: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        chipsReceived: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false
        },
        chipsCondition: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false
        },
        crewRemarks: {
            type: DataTypes.STRING,
           
        }
    },
    {
        timestamps: true,
    }
)
export default RequestOrder;