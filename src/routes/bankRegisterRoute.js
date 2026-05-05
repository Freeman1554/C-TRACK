import express from 'express';
import { loadAllBanks, loadAllBranchAddress } from '../services/bankService.js';
import { importAllBankData } from '../utils/importBankData.js';
import { getBankState, getBranchAddresses, getBranchDetails, getBranchLocalGovt } from '../controllers/bankRegisterController.js';
import { getChipDifferent } from '../controllers/chipdifferent.js';
import { createOrder } from '../controllers/orderController.js';
import deliveryPost from '../controllers/deliveryController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { deliveryValidator, orderValidator } from '../utils/validation.js';
import validationMiddleware from '../middleware/validationMiddleware.js';


const router = express.Router();


router.post("/import-excel", authMiddleware, importAllBankData)
router.get("/branch-address", loadAllBranchAddress)
router.get("/branchnames", getBranchDetails)
router.get("/branchaddress", getBranchAddresses)
router.get("/localgovt", getBranchLocalGovt)
router.get("/statelist", getBankState)
router.post("/order", authMiddleware, orderValidator,validationMiddleware, createOrder)
router.post("/delivery", authMiddleware, deliveryValidator, validationMiddleware, deliveryPost)
router.get("/chipdifference", getChipDifferent)

router.get("/banks", async (req, res) => {
  try {
    await importAllBankData();
    const data = await loadAllBanks();
    res.json({
      success: true,
      totalCount: data.totalCount,
      excelData: data.excelData,
      accessData: data.accessData,
      });
  
  } catch (err) {
    res.status(500).json({success: false, message: err.message});
  }
  
});





export default router;