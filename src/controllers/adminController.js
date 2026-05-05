import User from "../models/user.js";
import RequestOrder from "../models/order.js";
import Delivery from "../models/delivery.js";
import { calculateChipDifference } from "../services/allChipDifferenceService.js";
import { getChipDifferent } from "./chipdifferent.js";


export async function adminInfo (req, res) {
    try {
        const [usersRaw, orders, deliveries] = await Promise.all([
        User.findAll(),
        RequestOrder.findAll(),
        Delivery.findAll(),
    ]);

// removing sensitive fields
    const users = usersRaw.map(user=>{
        const {
            password, otp, 
            resetpasswordToken, 
            role, resetOtp, 
            resetOtpExpire, 
            ...safeUser} = user.toJSON();
        return safeUser
    })

    const chipDifferences = await calculateChipDifference(); 
      res.json({
        users, orders, deliveries, chipDifferences
    });

    } catch(error) {
        console.error("Error fetching all info:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}