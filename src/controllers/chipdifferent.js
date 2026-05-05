import Delivery from "../models/delivery.js";
import RequestOrder from "../models/order.js";

export const getChipDifferent = async (req, res)=>{
    try{
        const {bank} = req.query;
        if(!bank) {
            return res.status(400).json({message: "Bank name is required"});
        }
        //get total ordered chips
        const chipsReceived = await RequestOrder.sum("chipsReceived", {where:{ bank } });
        if(chipsReceived === null) {
            return res.status(404).json({message:"Order not found for this bank"});
        }
        //get delivery chips
        const chipsDelivered = await Delivery.sum("chipsdelivered", { where:{bank} });
        if(chipsDelivered === null){
            return res.status(404).json({message:"Delivery not found for this bank"});
        }
        
        const difference = chipsReceived - chipsDelivered;

        return res.status(200).json({
            bank,
            chipsReceived,
            chipsDelivered,
            difference
        });
    } catch (error){
        console.error("Error calculating chip difference:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};