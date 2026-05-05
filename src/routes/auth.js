import express from "express";
import { registerUser, signIn, logout, changePasswordController,
    forgotPassword, resendOtp, verifyEmail, 
    resetPasswordController
 } from "../controllers/authController.js";
import { userSignOut } from "../services/userService.js";
import { getUserProfile } from "../controllers/userController.js";
import { changePasswordValidator,registerValidator, signinValidator,
    verifyEmailValidation, resetPasswordValidator, forgotPasswordValidator
   } from "../utils/validation.js";
import { authMiddleware, verifyAccountMiddleware, verifyAuth } from "../middleware/authMiddleware.js";
import validatorMiddleware from "../middleware/validationMiddleware.js";

const router = express.Router()



router.post("/register", registerValidator, validatorMiddleware, registerUser);
router.post("/signin", signinValidator,validatorMiddleware, signIn);
router.post("/forgotpassword", forgotPasswordValidator, validatorMiddleware, forgotPassword);
router.post("/passwordreset/:token", resetPasswordValidator, validatorMiddleware, resetPasswordController);
router.post("/getemailotp", validatorMiddleware, resendOtp)
router.post("/verifyemail", verifyEmailValidation, validatorMiddleware, verifyEmail);
router.post("/changepassword", authMiddleware, changePasswordValidator, validatorMiddleware, changePasswordController)
//router.get("/sendotp", verifyAccountMiddleware, resendOtp)
router.get("/signout", authMiddleware, logout, userSignOut);
router.get("/profile", authMiddleware, getUserProfile)


export default router;
