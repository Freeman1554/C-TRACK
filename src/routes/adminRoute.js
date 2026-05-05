import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import User from "../models/user.js";
import { getChipDifferent } from "../controllers/chipdifferent.js";
import RequestOrder from "../models/order.js";
import Delivery from "../models/delivery.js";
import { calculateChipDifference } from "../services/allChipDifferenceService.js";
import { adminOnly } from "../controllers/userController.js";
import { deleteUser } from "../controllers/userController.js";
import { adminInfo } from "../controllers/adminController.js";
//import { authen } from "../middleware/authMiddleware.js";


const router = express.Router();


//Admin can fetch all users
router.get("/all-user", authMiddleware, isAdmin, async(req, res)=>{
    const users = await User.findAll();
    res.json(users);
})

router.get("/all-order", authMiddleware, isAdmin, async(req, res)=>{
    const order = await RequestOrder.findAll();
    res.json(order);
})

router.get("/all-delivery", authMiddleware, isAdmin, async(req, res)=>{
    const delivery = await Delivery.findAll(); 
    res.json(delivery)
})

router.get("/all-chipsdifference", authMiddleware, isAdmin, getChipDifferent);

router.delete("/:user_uuid", authMiddleware, adminOnly, deleteUser);

router.get("/all-info", authMiddleware, isAdmin, adminInfo);

export default router;