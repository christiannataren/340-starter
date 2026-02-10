/* Employee or admin can see */
const accountModel = require("../models/account-model");
const utilities = require("../utilities/");
Privileges = {}
Privileges.AdminEmployeePrivilege = async (req, res, next) => {
    let permissions = ["Admin", "Employee"]

    if (utilities.skipLogginByUrl(req.originalUrl)) {/////skip the login function if the url is in the contained array
        next()
        return
    }
    let privilege = await accountModel.getAccountPrivilege(res.locals.accountData.account_id)
    if (permissions.includes(privilege)) {
        next()
    } else {
        let nav = await utilities.getNav()
        res.status(201).render("errors/forbidden", {
            title: "Forbidden",
            nav,
            errors: null
        })
    }
}

module.exports = Privileges