import RequestOrder from "../models/order.js";


export async function createOrder (req, res){
    try{
        const order = await RequestOrder.create({
        bank: req.body.bank,
        chipsReceived: req.body.chipsReceived,
        chipsCondition: req.body.chipsCondition,
        crewRemarks: req.body.crewRemarks,    
        });
        res.status(201).json({
            message:" Order registered successfully",
            data: order,
        });
    } catch(error){
        res.status(400).json({message: error.message});
    }
}