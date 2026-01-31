const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}




/* ***************************
 *  Build Home view
 * ************************** */
invCont.buildIndex = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/index", {
        title: "Vehicle management",
        nav,
        errors: null
    })

}
/* ***************************
 *  Build Adding clasification controller
 * ************************** */
invCont.buildAddingClasification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/adding-clasification", {
        title: "Add New Clasification",
        nav,
        errors: null
    })

}

// Add Vehicle controller add-vehicle
invCont.buildAddingVehicle = async function (req, res, next) {
    let nav = await utilities.getNav()
    let clasifications = await invModel.getClassifications()
    let select_classifications = await utilities.buildSelectClassification(clasifications);
    res.render("./inventory/adding-vehicle", {
        title: "Add New Vehicle",
        nav,
        errors: null,
        select_classifications
    })

}
/* ***************************
 *  Build Adding vehicle POST controller
 * ************************** */
invCont.buildAddingVehiclePost = async function (req, res, next) {
    let nav = await utilities.getNav()
    let regResult = invModel.insertNewVehicle(req.vehicle);
    //

    if (regResult) {
        req.flash(
            "notice",
            `The ${req.vehicle.inv_model}  was successfully added.`
        )
        res.status(201).render("inventory/index", {
            title: "Vehicle management",
            nav,
            errors: null
        })
    } else {
        req.flash("error", "Sorry, the vehicle was not added")
        res.status(501).render("inventory/adding-vehicle", {
            title: "Add New Vehicle",
            nav,
            errors: null
        })
    }

}
/* ***************************
 *  Build Adding clasification POST controler
 * ************************** */
invCont.buildAddingClasificationPost = async function (req, res, next) {
    let nav = await utilities.getNav()
    let { classification_name } = req.body
    let regResult = invModel.insertNewClassification(classification_name);
    //

    if (regResult) {

        req.flash(
            "notice",
            `The ${classification_name} Classification was successfully added.`
        )
        res.redirect("/inv")
    } else {
        req.flash("error", "Sorry, the classification was not added")
        res.status(501).render("inventory/adding-clasification", {
            title: "Add New Classification",
            nav,
            errors: null
        })
    }

}
/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })

}

module.exports = invCont