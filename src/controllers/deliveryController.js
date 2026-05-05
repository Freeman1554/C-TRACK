import Delivery from "../models/delivery.js";


async function deliveryPost (req, res) {
 try{
    const send = await Delivery.create({
        bank: req.body.bank,
        branchname: req.body.branchname,
        branchaddress: req.body.branchaddress,
        localgovt: req.body.localgovt,
        state: req.body.state,
        chipsdelivered: req.body.chipsdelivered,
        receivedby: req.body.receivedby,
        receipt: req.body.receipt,
        remarks: req.body.remarks
    });
    res.status(200).json({
        message:"Delivery confirmed",
        data: send
    });
 } catch(error){
    res.status(400).json({message: error.message});
 }
}

export default deliveryPost;