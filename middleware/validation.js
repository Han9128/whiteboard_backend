
const {body,validationResult} = require('express-validator');

const validateRegister = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

    body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email'),

    body('password')
    .isStrongPassword({
        minLength:8,
        minLowercase:1,
        minUppercase:1,
        minNumbers:1,
        minSymbols:1,
    })
    .withMessage('Password must contain at least 8 characters, 1 uppercase, 1 lowercase, 1 number and 1 symbol.'),

    (req,res,next) => {
        const result = validationResult(req);
        if(!result.isEmpty()){
            const errors = result.array();
            return res.status(400).json({
                message:errors[0].msg,
                fields: Object.fromEntries(errors.map(e => [e.path,e.msg]))
            })
        }

        next();
    }
]

module.exports = {
    validateRegister
}