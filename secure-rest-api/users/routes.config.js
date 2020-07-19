const UsersController = require("./controllers/user.controller");
const PermissionMiddleware = require("../common/middlewares/authPermission");
const ValidationMiddleware = require("../common/middlewares/authValidation");
const config = require("../common/config/env.config");
const {
  validateSignUp,
  validateQuery,
} = require("../common/middlewares/formValidation");

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

exports.routesConfig = function (app) {
  app.post("/users", [validateSignUp, UsersController.signUp]);
  app.get("/users", [
    validateQuery,
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    UsersController.list,
  ]);
  app.get("/users/:userId", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.getById,
  ]);
  app.patch("/users/:userId", [
    ValidationMiddleware.validJWTNeeded,
    PermissionMiddleware.minimumPermissionLevelRequired(FREE),
    PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
    UsersController.patchById,
  ]);
};
