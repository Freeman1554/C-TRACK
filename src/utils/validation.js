import { body, check } from "express-validator";

const registerValidator = [
    body("username").notEmpty().withMessage("Username is required")
    .isLength({min:4}).withMessage("Username must be atleast 4 characters long"),

    body("email").notEmpty().withMessage("Email is required")
    .isEmail().withMessage("invalid email format"),
    //baill(),

    body("password").notEmpty().withMessage("Password is required")
    .isLength({min:8}). withMessage("Password must be atleast 8 characters"),

    body("confirmPassword").notEmpty().withMessage("Confirm password is required")
    .custom((value, {req})=>{
        if(req.body.password && value !== req.body.password){
            throw new Error ("Password did not match");
        }
        return true;
    }),

    body("phonenumber").optional().isMobilePhone().withMessage("Invalide phone number"),

];

const signinValidator = [
    body("email").trim()
    .notEmpty().withMessage("Emailis required")
    .isEmail().withMessage("Invalid Email or Password"),

    body("password").trim()
    .notEmpty().withMessage("password is required")
    .isLength({min:8}).withMessage("Password must be atleast 8 characters")
];

const changePasswordValidator = [
    body("oldPassword").notEmpty().withMessage("Old password is required"),

    body('newPassword').notEmpty().withMessage("New password is required")
    .isLength({min: 8}).withMessage('New password must be atleast 8 characters'),

    body("confirmPassword").notEmpty().withMessage("Confirm password is required")
    .custom((value, {req})=>{
        if (value !== req.body.newPassword) {
            throw new Error("Confirm password does not match new password");
        }
        return true;
    })
];

const forgotPasswordValidator = [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
];

const resetPasswordValidator = [
    // body("email")
    // .notEmpty().withMessage("Email is required")
    // .isEmail().withMessage("Invalid email"),
    // body("otp")
    // .notEmpty().withMessage("OTP is required")
    // .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 characters"),
    body("newPassword")
    .notEmpty().withMessage("New password is required")
    .isLength({ min: 8 }).withMessage("New password must be at least 8 characters"),
];

const verifyEmailValidation = [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),
    body("otp")
    .notEmpty().withMessage("OTP is required")
    .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 characters"),
];

const orderValidator = [
    body("bank").notEmpty().withMessage("Bank is required"),
    body("chipsReceived").notEmpty().withMessage("Value is expected"),
    body("chipsCondition").notEmpty().withMessage("Statement is expected"),
    body("crewRemarks").notEmpty().withMessage("Remarks Expected")
];

const deliveryValidator = [
    body("bank").notEmpty().withMessage("Bank is required"),
    body("branchname").notEmpty().withMessage("Branch Name expected"),
    body("branchaddress").notEmpty().withMessage("Address is expected"),
    body("localgovt").notEmpty().withMessage("Local government is expected"),
    body("state").notEmpty().withMessage("State is expected"),
    body("chipsdelivered").notEmpty().withMessage("Value is expected"),
    body("receivedby").notEmpty().withMessage("Entry is expected"),
    check("receipt").optional(),
    body("remarks").notEmpty().withMessage("Remark expected")

]

export { registerValidator, signinValidator, changePasswordValidator,
    forgotPasswordValidator, resetPasswordValidator, 
    orderValidator, verifyEmailValidation, deliveryValidator
}