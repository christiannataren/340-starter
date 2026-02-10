const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')
router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildDashboard));


router.get("/register", utilities.handleErrors(accountController.buildRegister));
router.get("/logout", utilities.handleErrors(accountController.logout));

// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(), regValidate.passwordRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)


///////////////Update routes
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdate));

router.post(
    "/update/:account_id",
    regValidate.updateRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.buildUpdatePost)
)
router.post(
    "/update/password/:account_id",
    regValidate.passwordRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.buildUpdatePasswordPost)
)



// Process the login attempt
router.post(
    "/update", regValidate.registationRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.buildUpdate)

)
router.post(
    "/login", regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)

)

module.exports = router;