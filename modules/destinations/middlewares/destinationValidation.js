const { body, validationResult } = require("express-validator");

const validateDestination = [
    body("name").notEmpty().withMessage("Name is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("rating").notEmpty().withMessage("Rating must be between 0 and 5"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        next();
    }
];

module.exports = { validateDestination};