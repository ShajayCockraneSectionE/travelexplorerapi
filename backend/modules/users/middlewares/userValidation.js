const { body, validationResult } = require("express-validator");

const validateUser = [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 4 }).withMessage("Password must be at least 4 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    }
];

module.exports = { validateUser };