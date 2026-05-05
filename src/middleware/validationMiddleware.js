// import { validationResult } from "express-validator";

// export function validatorMiddleware(req, res, next) {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({
//             success: false,
//             message: "Validation error",
//             errors: errors.array().map(err => err.msg)
//         });
//     }
//     next();
// }



import { validationResult } from "express-validator";

const myValidationResult = validationResult.withDefaults({
  formatter: error => error.msg,
});

const validationMiddleware = (req, res, next) => {
    const result = myValidationResult(req)

    if(!result.isEmpty()){
        return res.status(400).json({
            success: false,
            message: "Validation error",
            data: result.array()
        })
    }
    next();
};

export default validationMiddleware;