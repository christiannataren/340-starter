const utilities = require(".")
const { body, validationResult, matchedData } = require("express-validator")
const validate = {}
const invModel = require("../models/inventory-model")




/*adding validate id rule rules */

validate.validateVehicleId = (res, req) => {
    return [body("inv_id").trim()
        .escape()
        .notEmpty()
        .withMessage("Vehicle ID invalid")
        .isInt()
        .withMessage("Vehicle ID invalid")]
}

/*adding vehicle rules */
validate.addingVehicle = (res, req) => {
    return [
        body("classification_id")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("You must select a clasification")
            .custom(async (classification_id) => {
                let classi = await invModel.classificationIdExists(classification_id);
                if (!classi) {
                    throw new Error("This is not a valid classification")
                }

            })
        ,
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please introduce a Make")
            .isLength({ min: 3 })
            .withMessage("The make must be a 3-character minimum")
        ,
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please introduce a Model")
            .isLength({ min: 3 })
            .withMessage("The model must be a 3-character minimum")
        ,
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please introduc e a Description")
            .isLength({ min: 3 })
            .withMessage("Description must be a 3-character minimum")

        ,
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please introduce a Price")
            .isNumeric()
            .withMessage("Price must contain a number")
        ,
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please introduce a Year")
            .isInt()
            .withMessage("Year must contain a number")
            .isLength({ min: 4, max: 4 })
            .withMessage('Year must be exactly 4 digits')
        ,
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please introduce Mileage")
            .isInt()
            .withMessage("Miles must contain only digits")
            .isInt({ gt: 0 }).withMessage("Mileage must be a positive number")
        ,
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please introduce a Color")
        ,
        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please introduce an Image Path")
        ,
        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please introduce an Thumbnail Path")
        ,
    ]
}
/*adding clasification rules */
validate.addingClassification = () => {
    return [

        body("classification_name")
            .trim()
            .escape()
            .isAlpha()
            .withMessage("Name must be alphabetic characters only.")
            .custom(async (classification_name) => {
                const classificationExists = await invModel.classificationExists(classification_name)
                if (classificationExists) {
                    throw new Error("Classification exists. Please use a different name.")
                }
            })
        ,
    ]
}


// Validate Vehicle data
validate.checkVehicleData = async (req, res, next) => {
    let errors = []

    errors = validationResult(req)
    req.vehicle = matchedData(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let clasifications = await invModel.getClassifications()
        let select_classifications = await utilities.buildSelectClassification(clasifications, req.vehicle.classification_id);
        res.render("./inventory/adding-vehicle", {
            title: "Add New Vehicle",
            nav,
            errors,
            select_classifications,
            vehicle: req.vehicle
        })
        return
    }
    next()
}
// Validate edit Vehicle data
validate.checkUpdateData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    req.vehicle = matchedData(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let clasifications = await invModel.getClassifications()
        let select_classifications = await utilities.buildSelectClassification(clasifications, req.vehicle.classification_id);
        let model = req.vehicle.inv_model
        let make = req.vehicle.inv_make
        res.render("./inventory/edit-vehicle", {
            title: `Edit ${make} ${model}`,
            nav,
            errors,
            select_classifications,
            vehicle: req.vehicle
        })
        return
    }
    next()
}
/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("./inventory/adding-clasification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

module.exports = validate