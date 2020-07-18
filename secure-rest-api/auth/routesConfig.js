const VerifyUserMiddleware = require('./middleware/verifyUser');
const AuthorizationController = require('./controllers/authorization');
const AuthValidationMiddleware = require('../common/middlewares/authValidation');
const { validateLogin } = require("../common/middlewares/formValidation");

exports.routesConfig = function (app) {

    app.post('/auth', [
        validateLogin,
        VerifyUserMiddleware.isPasswordAndUserMatch,
        AuthorizationController.login
    ]);

    app.post('/auth/refresh', [
        AuthValidationMiddleware.validJWTNeeded,
        AuthValidationMiddleware.verifyRefreshBodyField,
        AuthValidationMiddleware.validRefreshNeeded,
        AuthorizationController.login
    ]);
};