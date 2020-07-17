const UsersController = require('./controllers/user.controller');

const { validateSignUp } = require('../common/middlewares/formValidation');

exports.routesConfig = function (app) {
    app.post('/users', [
        validateSignUp,
        UsersController.signUp
    ]);
};
